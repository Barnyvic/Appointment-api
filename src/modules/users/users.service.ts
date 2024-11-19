import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PasswordHelper, PhoneNumberHelper, Utils, ErrorHelper } from 'src/utils';
import isemail from 'isemail';
import { UsersRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities';
import { LoginAuthDto } from './dto/login.dto';
import { IUser, NotificationType } from 'src/interfaces';
import { ChangePasswordDto } from './dto/change-password.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Otp } from '../otp/otp.entity';
import { Repository } from 'typeorm';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from './enum';
import { BusinessService } from '../business/services/business.service';
import { CreateStaffDto } from '../staffs/dto/create-staff.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    private jwtService: JwtService,
    @InjectRepository(Otp) private otpRepo: Repository<Otp>,
    private readonly businessService: BusinessService
  ) {}
  async create(createUserDto: CreateUserDto) {
    const user = await this.createUser(
      createUserDto,
      createUserDto.role === Role.SERVICE_PROVIDER,
      createUserDto.role
    );
    return this.signUserToken(user);
  }

  async createStaff(createStaffDto: CreateStaffDto) {
    const user = await this.createUser(createStaffDto, false, Role.STAFF);
    return user;
  }

  private async createUser(
    userDto: CreateUserDto | CreateStaffDto,
    isServiceProvider: boolean,
    role?: Role
  ): Promise<User> {
    const userPhone = PhoneNumberHelper.formatToCountryStandard(userDto.phoneNumber);
    const validEmail = Utils.isEmailOrFail(userDto.emailAddress);

    const { emailCheck, phoneCheck } = await this.checkIfUserExist(validEmail, userPhone);
    if (emailCheck || phoneCheck) {
      ErrorHelper.ConflictException(`User with email or phone already exist`);
    }

    const hashedPassword = await PasswordHelper.hashPassword(userDto.password);

    const userData: any = {
      ...userDto,
      emailAddress: validEmail,
      phoneNumber: userPhone,
      password: hashedPassword,
      role: role || (userDto as CreateUserDto).role,
    };

    // Handle business profile creation for service providers
    if (isServiceProvider && 'businessProfile' in userDto && userDto.businessProfile) {
      const existingUser = await this.userRepository.findByEmail(validEmail);
      if (existingUser && existingUser.businessProfile) {
        ErrorHelper.ConflictException('User already has a business profile');
      }

      const businessProfile = await this.businessService.createBusinessProfile(
        userDto.businessProfile
      );
      userData.businessProfile = businessProfile;
    } else {
      delete userData.businessProfile;
    }

    return this.userRepository.save(userData);
  }
  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  async findUserByEmail(emailAddress: string) {
    const existingUser = await this.userRepository.findByEmail(emailAddress);
    return existingUser;
  }
  async update(id: string, updateUserDto: UpdateUserDto) {
    let existingUser = await this.userRepository.findById(id);
    if (!existingUser) {
      ErrorHelper.NotFoundException("User doesn't exist");
    }

    const emailAddress = updateUserDto.emailAddress;
    if (emailAddress) {
      // check if email already exists
      existingUser = await this.userRepository.findByEmail(emailAddress);
      if (existingUser && existingUser.id !== id) {
        ErrorHelper.ConflictException('User with Email already exist');
      }
    }

    const phoneNumber = updateUserDto.phoneNumber;
    if (phoneNumber) {
      // check if phone already exists
      existingUser = await this.userRepository.findByPhoneNumber(phoneNumber);
      if (existingUser && existingUser.id !== id) {
        ErrorHelper.ConflictException('User with Phone already exist');
      }
    }

    await this.userRepository.update(id, updateUserDto);

    return {
      ...updateUserDto,
    };
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async checkIfUserExist(emailAddress?: string, phoneNumber?: string) {
    const data = {
      emailCheck: false,
      phoneCheck: false,
    };

    if (emailAddress) {
      const user = await this.userRepository.count({
        where: {
          emailAddress,
        },
      });
      data.emailCheck = user > 0;
    }

    if (phoneNumber) {
      const user = await this.userRepository.count({
        where: {
          phoneNumber,
        },
      });
      data.phoneCheck = user > 0;
    }
    return data;
  }

  async signUserToken(user: User) {
    const userInfo = {
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
      phoneNumber: user.phoneNumber,
      id: user.id,
      photoUrl: user.photoUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      birthdate: user.birthdate,
      emailVerified: user.emailVerified,
    };

    if (user.role === Role.SERVICE_PROVIDER && user.businessProfile) {
      userInfo['businessId'] = user.businessProfile?.id;
      userInfo['businessName'] = user.businessProfile?.businessName;
      userInfo['staff'] = user.businessProfile?.staff;
      userInfo['currency'] = user.businessProfile?.businessCurrency;
    }

    const token = this.jwtService.sign(userInfo);

    return {
      ...userInfo,
      accessToken: token,
    };
  }

  async login(data: LoginAuthDto) {
    let { userId } = data;
    const { password } = data;

    if (!Utils.isEmail(userId)) {
      userId = PhoneNumberHelper.formatToCountryStandard(userId);
    }

    const registeredUser = await this.userRepository.findByEmailOrPhoneNumber(userId);
    const isPasswordCorrect = registeredUser
      ? await PasswordHelper.comparePassword(password, registeredUser.password)
      : null;

    if (!registeredUser || !isPasswordCorrect) {
      ErrorHelper.BadRequestException('User ID or password specified is incorrect');
    }
    return this.signUserToken(registeredUser);
  }

  async changePassword(user: IUser, data: ChangePasswordDto) {
    // check if old password is correct
    const registeredUser = await this.userRepository.findByEmail(user.emailAddress);

    const isCurrentPasswordCorrect = registeredUser
      ? await PasswordHelper.comparePassword(data.currentPassword, registeredUser.password)
      : null;

    if (!isCurrentPasswordCorrect) {
      ErrorHelper.BadRequestException('Current password is incorrect');
    }

    const hashedPassword = await PasswordHelper.hashPassword(data.newPassword);
    await this.userRepository.updatePassword(registeredUser.id, hashedPassword);
  }

  async resetPassword(data: ResetPasswordDto) {
    let userIdentifier: string;

    if (isemail.validate(data.userIdentifier)) {
      userIdentifier = Utils.isEmailOrFail(data.userIdentifier);
    } else {
      userIdentifier = PhoneNumberHelper.formatToCountryStandard(data.userIdentifier);
    }

    const verifiedOtp = await this.otpRepo.findOne({
      where: {
        userIdentifier,
        type: NotificationType.RESET_PASSWORD,
        isUsed: true,
        code: data.code,
      },
    });

    if (!verifiedOtp) {
      ErrorHelper.ForbiddenException('Invalid OTP Code');
    }

    const user = await this.userRepository.findByEmailOrPhoneNumber(userIdentifier);

    if (!user) {
      ErrorHelper.ForbiddenException('User Not Found');
    }

    const hashedPassword = await PasswordHelper.hashPassword(data.password);
    await this.userRepository.updatePassword(user.id, hashedPassword);

    await this.otpRepo.remove(verifiedOtp);

    return true;
  }

  async getUserById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      ErrorHelper.ForbiddenException('User Not Found');
    }
    return user;
  }

  async getTotalCustomerForABusiness(businessId: string) {
    return await this.userRepository.totalCustomerForBusiness(businessId);
  }

  async getUserDashboardData(_user) {
    // - upcoming appointments
    // - personal recommendation
    // - services
  }
}
