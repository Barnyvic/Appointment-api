import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { NOTIFICATION_QUEUE } from './worker.contants';
import { FirebaseService } from 'src/shared/firebase/firebase.service';
import { NotificationService } from '../notifications/notification.service';
import { UserFcmTokenService } from '../users/fmc-token.service';
import { CreateNotificationType } from 'src/interfaces';
import { Processor, Process } from '@nestjs/bull';

@Processor(NOTIFICATION_QUEUE)
export class NotificationWorker {
  private readonly logger = new Logger(NotificationWorker.name);
  constructor(
    private readonly notificationService: NotificationService,
    private readonly userFcmTokenService: UserFcmTokenService,
    private readonly firebaseService: FirebaseService
  ) {}

  @Process('send-notification')
  public async process(job: Job<any, any, string>): Promise<void> {
    const { data }: { data: CreateNotificationType } = job;
    try {
      const notification = await this.notificationService.createNotification(data);

      const userFcmToken = await this.userFcmTokenService.getUserFmcTokenByUserId(data.userId);

      if (!userFcmToken) {
        this.logger.log(`User ${data.userId} doesn't have fcm token`);
        return;
      }

      await this.firebaseService.sendNotification(
        [userFcmToken.token],
        {
          notification: {
            title: notification.title,
            body: notification.content,
            icon: notification.image,
          },
          data: {
            type: data.type,
          },
        },
        false,
        data.notificationImage
      );

      this.logger.log(`Notification sent to ${data.userId}`);
    } catch (error) {
      this.logger.error(`Error processing job: ${error.message}`);
    }
  }
}
