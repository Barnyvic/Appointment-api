import { BaseTable } from '../../../base';
import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../modules/users/entities/user.entity';
import { BusinessProfile } from '../../../modules/business/entities';

@Entity({ name: 'reviews' })
export class Review extends BaseTable {
  @Column({ type: 'text' })
  reviewText: string;

  @Column({ type: 'decimal', precision: 2, scale: 1, nullable: true })
  rating: number;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.reviews, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'businessProfileId' })
  businessProfile: BusinessProfile;

  @ManyToOne(() => User, user => user.reviews, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;
}
