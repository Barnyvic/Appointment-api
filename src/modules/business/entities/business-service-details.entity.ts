import { Entity, Column, ManyToOne, OneToMany, ManyToMany } from 'typeorm';
import { BusinessProfile } from './business.entity';
import { BaseTable } from '../../../base';
import { Appointment } from '../../../modules/appointments/entities';
import { Currency } from '../enum';
import { Staff } from '../../../modules/staffs/entities';
import { Transaction } from '../../transactions/entities/transaction.entity';

@Entity()
export class ServiceDetails extends BaseTable {
  @Column({ type: 'varchar', length: 255 })
  serviceName: string;

  @Column({ type: 'varchar', length: 255 })
  serviceType: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string;

  @Column('int')
  timeHours: number;

  @Column('int')
  timeMinutes: number;

  @Column({ type: 'varchar', length: 50 })
  amount: string;

  @Column({ type: 'varchar', default: Currency.NGN })
  currency: Currency;

  @Column({ type: 'simple-array', nullable: true })
  image: string[];

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.services)
  businessProfile: BusinessProfile;

  @Column({ type: 'boolean', default: false })
  isArchived: boolean;

  @OneToMany(() => Appointment, appointment => appointment.serviceDetails)
  appointments: Appointment[];

  @ManyToMany(() => Staff, staff => staff.services)
  staff: Staff[];

  @OneToMany(() => Transaction, transaction => transaction.serviceDetails)
  transactions: Transaction[];
}
