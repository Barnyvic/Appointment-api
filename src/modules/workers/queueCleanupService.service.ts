import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { NOTIFICATION_QUEUE } from './worker.contants';

@Injectable()
export class QueueCleanupService {
  constructor(@InjectQueue(NOTIFICATION_QUEUE) private notificationQueue: Queue) {}

  @Cron(CronExpression.EVERY_HOUR)
  async cleanOldJobs() {
    await this.notificationQueue.clean(3600000, 'completed');

    await this.notificationQueue.clean(7200000, 'failed');
  }
}
