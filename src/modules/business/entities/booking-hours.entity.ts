import { BaseTable } from '../../../base';
import { Entity, Column, ManyToOne } from 'typeorm';
import { BusinessProfile } from './business.entity';
import { DaysOfWeek } from '../enum';

@Entity()
export class BookingHours extends BaseTable {
  @Column({ type: 'varchar', default: DaysOfWeek, nullable: true })
  day: DaysOfWeek;

  @Column({ type: 'time', nullable: true })
  from: string;

  @Column({ type: 'time', nullable: true })
  to: string;

  @Column({ default: false, nullable: true })
  isClosed: boolean;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.bookingHours)
  businessProfile: BusinessProfile;
}
