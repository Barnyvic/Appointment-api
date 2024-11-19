import { Appointment, Availability } from '../../../modules/appointments/entities';
import { BaseTable } from '../../../base';
import { BusinessProfile, ServiceDetails } from '../../../modules/business/entities/index';
import { User } from '../../../modules/users/entities/index';
import { Entity, JoinTable, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { Notification } from '../../notifications/entities';

@Entity({ name: 'staff' })
export class Staff extends BaseTable {
  @ManyToOne(() => BusinessProfile, businessProfile => businessProfile.staff)
  businessProfile: BusinessProfile;

  @ManyToOne(() => User, user => user.staff, { nullable: true })
  user: User;

  @OneToMany(() => Appointment, appointment => appointment.assignedStaff)
  appointments: Appointment[];

  @OneToMany(() => Notification, notification => notification.staff)
  notifications: Notification[];

  @OneToMany(() => Availability, availability => availability.staff)
  availabilities: Availability[];

  @ManyToMany(() => ServiceDetails, serviceDetails => serviceDetails.staff)
  @JoinTable()
  services: ServiceDetails[];
}
