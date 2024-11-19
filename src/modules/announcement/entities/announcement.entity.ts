import { BusinessProfile } from '../../business/entities';
import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseTable } from '../../../base';

@Entity({ name: 'announcement' })
export class Announcement extends BaseTable {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'timestamp', nullable: true })
  publishDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  validUntil: Date;

  @Column({ type: 'simple-array', nullable: true })
  images: string[];

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.announcements, {
    onDelete: 'CASCADE',
  })
  businessProfile: BusinessProfile;
}
