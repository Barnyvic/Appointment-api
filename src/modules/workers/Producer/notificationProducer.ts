import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { NOTIFICATION_QUEUE } from '../worker.contants';
import { CreateNotificationType } from 'src/interfaces';

@Injectable()
export class NotificationQueue {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue) {}

  async createNotificationQueue(notificationData: CreateNotificationType) {
    await this.notificationQueue.add('send-notification', notificationData);
  }
}
