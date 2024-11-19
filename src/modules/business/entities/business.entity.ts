import { BaseTable } from '../../../base';
import { Column, Entity, Index, OneToOne, OneToMany, JoinColumn } from 'typeorm';
import { BusinessCategory, Currency, ServiceOffering, TeamSize } from '../enum';
import { ServiceDetails } from './business-service-details.entity';
import { BookingHours } from './booking-hours.entity';
import { Point } from 'geojson';
import { Appointment } from '../../../modules/appointments/entities';
import { Availability } from '../../../modules/appointments/entities/availability.entity';
import { Staff } from '../../../modules/staffs/entities/index';
import { User } from '../../../modules/users/entities/index';
import { CashFlow } from '../../../modules/cashflow/entities';
import { Review } from '../../../modules/reviews/entities/review.entity';
import { Announcement } from '../../../modules/announcement/entities';
import { PaymentInformation } from './payment-information.entity';
import { Favorite } from '../../Favorite/entities/favorites.entity';

@Entity({ name: 'businessProfile' })
export class BusinessProfile extends BaseTable {
  @Column({ type: 'varchar', length: 50 })
  businessName: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  businessAddress: string;

  @Column({ type: 'simple-array' })
  serviceOffering: ServiceOffering[];

  @Column({ type: 'varchar', nullable: true })
  about: string;

  @Column({ type: 'varchar', nullable: true })
  description: string;

  @Column({ type: 'varchar', default: TeamSize.JUST_ME })
  teamSize: TeamSize;

  @Column({ type: 'text', array: true, nullable: true })
  businessCategory: BusinessCategory[];

  @OneToMany(() => ServiceDetails, serviceDetails => serviceDetails.businessProfile, {
    cascade: true,
  })
  services: ServiceDetails[];

  @OneToMany(() => BookingHours, bookingHours => bookingHours.businessProfile, { cascade: true })
  bookingHours: BookingHours[];

  @Index({ spatial: true })
  @Column({ type: 'geometry', spatialFeatureType: 'Point', srid: 4326, nullable: true })
  coordinates: Point;

  @Column({ type: 'varchar', length: 255, nullable: true })
  instagramLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  facebookLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  twitterLink: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  tiktokLink: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  country: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  state: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  city: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  zipCode: string;

  @Column({ type: 'simple-array', nullable: true })
  businessImage: string[];

  @Column({ type: 'varchar', default: Currency.NGN })
  businessCurrency: Currency;

  @Column({ type: 'varchar', length: 255, nullable: true })
  businessLogo: string;

  @OneToOne(() => User)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Appointment, appointment => appointment.businessProfile, { cascade: true })
  appointments: Appointment[];

  @OneToMany(() => Availability, availability => availability.businessProfile, { cascade: true })
  availabilities: Availability[];

  @OneToMany(() => Staff, staff => staff.businessProfile, { cascade: true })
  staff: Staff[];

  @OneToMany(() => CashFlow, cashFlow => cashFlow.businessProfile, { cascade: true })
  cashFlows: CashFlow[];

  @OneToMany(() => Review, review => review.businessProfile, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Announcement, announcement => announcement.businessProfile, { cascade: true })
  announcements: Announcement[];

  @OneToOne(() => PaymentInformation, paymentInformation => paymentInformation.businessProfile, {
    cascade: true,
  })
  paymentInformation: PaymentInformation;

  @OneToMany(() => Favorite, favorite => favorite.businessProfile)
  favorites: Favorite[];
}
