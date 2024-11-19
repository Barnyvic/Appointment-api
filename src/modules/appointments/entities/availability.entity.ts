import { Staff } from '../../../modules/staffs/entities';
import { BaseTable } from '../../../base';
import { BusinessProfile } from '../../../modules/business/entities';
import { Entity, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'availability' })
export class Availability extends BaseTable {
  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'int' })
  interval: number;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.availabilities)
  businessProfile: BusinessProfile;

  @ManyToOne(() => Staff, staff => staff.availabilities)
  staff: Staff;
}
