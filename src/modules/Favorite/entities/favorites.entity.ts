import { BaseTable } from '../../../base';
import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { BusinessProfile } from '../../business/entities';

@Entity({ name: 'favorites' })
export class Favorite extends BaseTable {
  @ManyToOne(() => User, user => user.favorites, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.favorites, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessProfileId' })
  businessProfile: BusinessProfile;
}
