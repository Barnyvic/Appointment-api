import { User } from '../../../modules/users/entities';
import { BaseTable } from '../../../base';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BusinessProfile, ServiceDetails } from '../../../modules/business/entities';
import { AppointmentStatus } from '../enum/appointmnet-status.enum';
import { Staff } from '../../../modules/staffs/entities';
import { Notification } from '../../notifications/entities';

@Entity({ name: 'Appointment' })
export class Appointment extends BaseTable {
  @Column({ type: 'timestamp' })
  appointmentDate: Date;

  @Column({ type: 'time' })
  startTime: string;

  @Column({ type: 'time' })
  endTime: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', default: AppointmentStatus.PENDING })
  status: AppointmentStatus;

  @Column({ type: 'boolean', default: true })
  isAvailable: boolean;

  @Column({ type: 'boolean', default: false })
  rescheduleRequested: boolean;

  @Column({ type: 'varchar', nullable: true })
  rescheduleMessage: string;

  @Column({ type: 'varchar', nullable: true })
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  customerEmail: string;

  @Column({ type: 'varchar', nullable: true })
  reasonForCancellation: string;

  @Column({ type: 'varchar', nullable: true })
  customerPhoneNumber: string;

  @ManyToOne(() => User, user => user.appointments)
  customer: User;

  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.appointments)
  businessProfile: BusinessProfile;

  @ManyToOne(() => ServiceDetails, serviceDetails => serviceDetails.appointments)
  serviceDetails: ServiceDetails;

  @ManyToOne(() => Staff, staff => staff.appointments, { nullable: true })
  assignedStaff: Staff;

  @OneToMany(() => Notification, notification => notification.appointment)
  notifications: Notification[];
}
