import { Repository } from 'typeorm';
import { CustomRepository } from '../../typeorm-extension';
import { User } from './entities';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
  async findByEmail(emailAddress: string): Promise<User> {
    return this.findOne({
      where: {
        emailAddress,
      },
    });
  }

  async findById(id: string): Promise<User> {
    return this.findOne({
      where: {
        id,
      },
      relations: ['businessProfile'],
    });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.findOne({
      where: {
        phoneNumber,
      },
    });
  }

  async findByEmailOrPhoneNumber(userId: string): Promise<User> {
    return this.findOne({
      where: [
        {
          emailAddress: userId,
        },
        {
          phoneNumber: userId,
        },
      ],
      relations: ['businessProfile'],
    });
  }

  async updatePassword(id: string, password: string) {
    return this.update(id, {
      password,
    });
  }

  async verifyUserEmail(id: string) {
    return this.update(id, {
      emailVerified: true,
    });
  }

  async totalCustomerForBusiness(businessId: string): Promise<number> {
    return await this.createQueryBuilder('user')
      .leftJoin('user.appointments', 'appointment')
      .where('appointment.businessProfile.id = :businessId', { businessId })
      .getCount();
  }
}
