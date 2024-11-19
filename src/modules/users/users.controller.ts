import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpResponse } from 'src/utils';
import { User } from 'src/decorators';
import { LoginAuthDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthGuard } from 'src/guards';
import { IUser } from 'src/interfaces';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UserFcmTokenService } from './fmc-token.service';
import { CreateUserFmcDto } from './dto/create-user-token.dto';
import { CheckUserDTO } from './dto/check-user.dto';
import { CheckUserExistenceDto } from './dto/check-user-existence.dto';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userFcmTokenService: UserFcmTokenService
  ) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const data = await this.usersService.create(createUserDto);

    return HttpResponse.success({
      data,
      message: 'User created successfully',
    });
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async update(@User() user: IUser, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.usersService.update(user.id, updateUserDto);

    return HttpResponse.success({
      data,
      message: 'User updated successfully',
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('login')
  async login(@Body() authDto: LoginAuthDto) {
    const data = await this.usersService.login(authDto);

    return HttpResponse.success({
      data,
      message: 'User login successfully',
    });
  }

  @Post('change-password')
  @UseGuards(AuthGuard)
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @User() user: IUser) {
    await this.usersService.changePassword(user, changePasswordDto);

    return HttpResponse.success({ data: '', message: 'Password Changed Successfully' });
  }

  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    await this.usersService.resetPassword(resetPasswordDto);

    return HttpResponse.success({ data: '', message: 'Password Reset Successful' });
  }

  @Get('dashboard')
  @UseGuards(AuthGuard)
  async retrieveUserDashboard(@User() user: IUser) {
    await this.usersService.getUserDashboardData(user);

    return HttpResponse.success({ data: '', message: 'Dashboard Retrieval Successful' });
  }

  @Post('/notification-token')
  @UseGuards(AuthGuard)
  async updateNotificationToken(@Body() createUserFmcDto: CreateUserFmcDto, @User() user: IUser) {
    const data = await this.userFcmTokenService.createUserFmcToken(createUserFmcDto, user.id);
    return HttpResponse.success({
      data,
      message: 'Notification token updated successfully',
    });
  }

  @Post('check-user-existence')
  async checkUserExistence(@Body() checkUserExistenceDto: CheckUserExistenceDto) {
    const data = await this.usersService.checkIfUserExist(
      checkUserExistenceDto.emailAddress,
      checkUserExistenceDto.phoneNumber
    );

    return HttpResponse.success({
      data,
      message: 'User existence check completed',
    });
  }
}
