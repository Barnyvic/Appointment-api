import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseTable } from '../../../base';
import { NotificationType } from '../../../interfaces';
import { User } from '../../users/entities';
import { Appointment } from '../../appointments/entities';
import { Staff } from '../../staffs/entities';

@Entity({ name: 'notification' })
export class Notification extends BaseTable {
  @Column({
    type: 'uuid',
    nullable: false,
  })
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToOne(() => Staff, staff => staff.notifications, { nullable: true })
  staff: Staff;

  @ManyToOne(() => Appointment, appointment => appointment.notifications, { nullable: true })
  appointment: Appointment;

  @Column({
    type: 'text',
    nullable: false,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image: string;

  @Column({
    type: 'varchar',
    nullable: false,
  })
  type: NotificationType;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata: Record<string, any>;
}
