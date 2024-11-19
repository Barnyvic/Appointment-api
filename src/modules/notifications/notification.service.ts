import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TermiiService } from 'src/shared/lib';
import { Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import {
  CreateNotificationType,
  NotificationMessageType,
  NotificationChannels,
  NotificationType,
} from '../../interfaces';
import { Notification } from './entities/notification.entity';
import { getMessage, messages } from './notification.messages';
import { AppointmentsService } from '../appointments/service/appointments.service';
import { NotificationQueue } from '../workers/Producer/notificationProducer';
import { Utils } from 'src/utils';
import { format } from 'date-fns';

@Injectable()
export class NotificationService {
  mailService: any;

  constructor(
    @InjectRepository(Notification)
    private notificationRepo: Repository<Notification>,
    private readonly termiiService: TermiiService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    private readonly notificationQueue: NotificationQueue
  ) {}

  async get(userId: any) {
    const notifications = await this.notificationRepo.find({
      where: { userId },
      order: { id: 'DESC' },
      take: 20,
    });

    if (!Array.isArray(notifications)) {
      return [];
    }

    return notifications.map(notification => {
      const { metadata, type } = notification;
      let formattedContent = notification.content;

      switch (type) {
        case NotificationType.BOOKED_APPOINTMENT:
        case NotificationType.RESCHEDULED_APPOINTMENT:
        case NotificationType.CANCELLED_APPOINTMENT:
        case NotificationType.UPCOMING_APPOINTMENT:
        case NotificationType.DAILY_REMINDER:
        case NotificationType.RESCHEDULE_CONFIRMED:
        case NotificationType.RESCHEDULE_REQUESTED:
        case NotificationType.APPOINTMENT_CONFIRMED:
          if (metadata?.date && !isNaN(new Date(metadata.date).getTime())) {
            formattedContent = Utils.formatString(
              messages[type].content,
              metadata?.businessName || '',
              metadata?.serviceName || '',
              format(new Date(metadata.date), 'MMMM dd, yyyy') || '',
              metadata?.startTime || ''
            );
          } else {
            formattedContent = Utils.formatString(
              messages[type].content,
              metadata?.businessName || '',
              metadata?.serviceName || '',
              '',
              metadata?.startTime || ''
            );
          }
          break;

        case NotificationType.STAFF_CREATED:
        case NotificationType.WELCOME_NEW_STAFF:
          formattedContent = Utils.formatString(
            messages[type].content,
            metadata?.email || '',
            metadata?.password || ''
          );
          break;

        case NotificationType.VERIFY_PHONE:
        case NotificationType.RESET_PASSWORD:
        case NotificationType.VERIFY_EMAIL:
          formattedContent = Utils.formatString(
            messages[type].content,
            metadata?.trackingCode || ''
          );
          break;

        case NotificationType.PROFILE_UPDATE:
          if (metadata?.updatedFields && Array.isArray(metadata.updatedFields)) {
            const fields = metadata.updatedFields.join(', ');
            formattedContent = `Your profile has been updated. The following fields were changed: ${fields}.`;
          }
          break;

        default:
          formattedContent = notification.content;
          break;
      }

      formattedContent = formattedContent.replace(/[\n\r]/g, '');

      return {
        ...notification,
        content: formattedContent,
      };
    });
  }

  async createNotification(data: CreateNotificationType): Promise<Notification> {
    const message = getMessage(data.type, data.metadata);

    return this.notificationRepo.save(
      this.notificationRepo.create({
        userId: data.userId,
        title: message.title,
        content: message.content,
        type: data.type,
        image: data.notificationImage,
        metadata: data.metadata,
      })
    );
  }

  async sendNotificationMessage(data: NotificationMessageType): Promise<void> {
    switch (data.type) {
      case NotificationChannels.SMS:
        await this.termiiService.sendMessage({
          userIdentifier: data.recipient,
          message: data.message,
        });
        break;
      case NotificationChannels.EMAIL:
        await this.mailService.sendVerificationEmail(data);
        break;
      case NotificationChannels.WHATSAPP:
      case NotificationChannels.CALL:
        Logger.log(`${data.type}-${data.message}`);
        break;
      default:
        await this.termiiService.sendMessage({
          userIdentifier: data.recipient,
          message: data.message,
        });
    }
  }

  async queueNotification(data: CreateNotificationType) {
    await this.notificationQueue.createNotificationQueue(data);
  }

  @Cron(CronExpression.EVERY_DAY_AT_7AM)
  async sendDailyReminders() {
    const appointments = await this.appointmentsService.getAllAppointmentsForToday();
    for (const appointment of appointments) {
      await this.queueNotification({
        userId: appointment.customer.id,
        type: NotificationType.DAILY_REMINDER,
        metadata: {
          appointmentId: appointment.id,
          appointmentDate: appointment.appointmentDate,
          startTime: appointment.startTime,
        },
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async sendUpcomingNotifications() {
    const currentTime = new Date();
    const intervals = [
      { name: '24 hours', offset: 24 * 60 },
      { name: '1 hour', offset: 60 },
      { name: '15 minutes', offset: 15 },
    ];

    for (const interval of intervals) {
      const notificationTime = new Date(currentTime.getTime() + interval.offset * 60000);
      const appointments = await this.appointmentsService.findUpcomingAppointments(
        currentTime,
        notificationTime
      );
      for (const appointment of appointments) {
        await this.createNotificationsForAppointment(appointment, interval.name);
      }
    }
  }

  private async createNotificationsForAppointment(appointment, intervalName: string) {
    const { customer, businessProfile, assignedStaff, appointmentDate, startTime } = appointment;

    // Construct content based on available metadata
    const customerContent = `Your appointment with ${customer.firstName} ${customer.lastName} is scheduled for ${appointmentDate} at ${startTime}.`;
    const businessContent = `Your appointment with ${businessProfile.businessName} is scheduled for ${appointmentDate} at ${startTime}.`;

    // Notify customer
    await this.queueNotification({
      userId: customer.id,
      type: NotificationType.UPCOMING_APPOINTMENT,
      metadata: {
        appointmentId: appointment.id,
        appointmentDate,
        startTime,
        businessName: businessProfile.businessName,
        interval: intervalName,
      },
    });

    // Notify business owner
    await this.queueNotification({
      userId: businessProfile.owner.id,
      type: NotificationType.UPCOMING_APPOINTMENT,
      metadata: {
        appointmentId: appointment.id,
        appointmentDate,
        startTime,
        customerName: `${customer.firstName} ${customer.lastName}`,
        interval: intervalName,
      },
    });

    // Notify assigned staff if any
    if (assignedStaff) {
      await this.queueNotification({
        userId: assignedStaff.user.id,
        type: NotificationType.UPCOMING_APPOINTMENT,
        metadata: {
          appointmentId: appointment.id,
          appointmentDate,
          startTime,
          customerName: `${customer.firstName} ${customer.lastName}`,
          interval: intervalName,
        },
      });
    }
  }
}
