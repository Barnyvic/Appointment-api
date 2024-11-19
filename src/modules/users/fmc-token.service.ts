import { Injectable } from '@nestjs/common';
import { UserFcmTokenRepository } from './fmc-token.repository';
import { UsersService } from './users.service';
import { CreateUserFmcDto } from './dto/create-user-token.dto';
import { UserFcmToken } from './entities';
import { ErrorHelper } from 'src/utils';

@Injectable()
export class UserFcmTokenService {
  constructor(
    private readonly userFcmTokenRepository: UserFcmTokenRepository,
    private readonly usersService: UsersService
  ) {}

  async createUserFmcToken(data: CreateUserFmcDto, userId: string) {
    try {
      const user = await this.usersService.getUserById(userId);
      if (!user) {
        ErrorHelper.NotFoundException(`User with ID "${userId}" not found`);
      }

      const createFmcData = {
        token: data.token,
        user: user,
        userId: user.id,
      };

      return await this.userFcmTokenRepository.createOrUpdateToken(createFmcData);
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(`Failed to create FCM token: ${error.message}`);
      } else {
        ErrorHelper.InternalServerErrorException('Failed to create FCM token: Server Error');
      }
    }
  }

  async getUserFmcTokenByUserId(userId: string): Promise<UserFcmToken> {
    try {
      const token = await this.userFcmTokenRepository.findTokenByUserId(userId);
      if (!token) {
        ErrorHelper.NotFoundException(`FCM token for User ID "${userId}" not found`);
      }
      return token;
    } catch (error: unknown) {
      if (error instanceof Error) {
        ErrorHelper.InternalServerErrorException(
          `Failed to fetch FCM token by User ID: ${error.message}`
        );
      } else {
        ErrorHelper.InternalServerErrorException('Failed to fetch FCM token: Server Error');
      }
    }
  }
}
