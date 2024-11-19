import { Role } from '../enum';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Exclude } from 'class-transformer';
import { BaseTable } from '../../../base';
import { BusinessProfile } from '../../business/entities';
import { Appointment } from '../../../modules/appointments/entities';
import { Staff } from '../../../modules/staffs/entities/index';
import { Notification } from '../../notifications/entities';
import { Review } from '../../../modules/reviews/entities/review.entity';
import { Transaction } from '../../transactions/entities/transaction.entity';
import { Favorite } from '../../Favorite/entities/favorites.entity';

@Entity({ name: 'user' })
export class User extends BaseTable {
  @Column({ type: 'varchar', length: 50 })
  firstName: string;

  @Column({ type: 'varchar', length: 50 })
  lastName: string;

  @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
  emailAddress: string;

  @Column({ type: 'boolean', default: false })
  emailVerified: boolean;

  @Column({ type: 'varchar', length: 20, unique: true, nullable: true })
  phoneNumber: string;

  @Column({ type: 'date', nullable: true })
  birthdate: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  referralCode: string;

  @Column({ type: 'varchar', default: Role.USER })
  role: Role;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Exclude()
  @Column({ type: 'text', nullable: false })
  password: string;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @OneToOne(() => BusinessProfile, businessProfile => businessProfile.owner)
  businessProfile: BusinessProfile;

  @OneToMany(() => Appointment, appointment => appointment.customer)
  appointments: Appointment[];

  @OneToMany(() => Staff, staff => staff.user)
  staff: Staff[];

  @OneToMany(() => Notification, notification => notification.user)
  notifications: Notification[];

  @OneToMany(() => Review, review => review.user)
  reviews: Review[];

  @OneToMany(() => Transaction, transaction => transaction.user)
  transactions: Transaction[];

  @OneToMany(() => Favorite, favorite => favorite.user)
  favorites: Favorite[];
}
