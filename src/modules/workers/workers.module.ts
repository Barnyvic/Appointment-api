import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { NOTIFICATION_QUEUE } from './worker.contants';
import { BullModule } from '@nestjs/bull';
import { NotificationModule } from '../notifications/notification.module';
import { FirebaseModule } from '../../shared/firebase/firebase.module';
import { UsersModule } from '../users/users.module';
import { NotificationQueue } from './Producer/notificationProducer';
import { NotificationWorker } from './notification.worker';
import { QueueCleanupService } from './queueCleanupService.service';

const queueOptions = {
  options: {
    defaultJobOptions: {
      removeOnComplete: true,
      removeOnFail: true,
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 1000,
      },
      timeout: 5000,
    },
  },
};

const queues = [NOTIFICATION_QUEUE];
@Module({
  imports: [
    HttpModule,
    ...queues.map(queue =>
      BullModule.registerQueue({
        name: queue,
        ...queueOptions,
      })
    ),
    forwardRef(() => NotificationModule),
    FirebaseModule,
    forwardRef(() => UsersModule),
  ],
  providers: [NotificationWorker, NotificationQueue, QueueCleanupService],
  exports: [NotificationQueue],
})
export class BullBoardModule {}
