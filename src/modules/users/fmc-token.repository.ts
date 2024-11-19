import { CustomRepository } from 'src/typeorm-extension';
import { Repository } from 'typeorm';
import { UserFcmToken } from './entities';

@CustomRepository(UserFcmToken)
export class UserFcmTokenRepository extends Repository<UserFcmToken> {
  async findTokenByUserId(userId: string) {
    return await this.findOne({
      where: {
        userId: userId,
      },
    });
  }

  async createOrUpdateToken(data: Partial<UserFcmToken>): Promise<UserFcmToken> {
    const existingToken = await this.findTokenByUserId(data.userId);
    if (existingToken) {
      return await this.save({ ...existingToken, ...data });
    } else {
      const newToken = this.create(data);
      return await this.save(newToken);
    }
  }
}
