import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { BaseTable } from '../../../base';
import { User } from './user.entity';

@Entity({ name: 'user_fcm_token' })
export class UserFcmToken extends BaseTable {
  @Column({ type: 'uuid', nullable: false })
  userId: string;

  @Column({ type: 'text', nullable: false })
  token: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;
}
