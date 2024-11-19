/* eslint-disable no-await-in-loop */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as firebaseAdmin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  logger = new Logger(FirebaseService.name);

  constructor(configService: ConfigService) {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: configService.get('FIREBASE_PROJECT_ID'),
        privateKey: configService.get('FIREBASE_PRIVATE_KEY'),
        clientEmail: configService.get('FIREBASE_CLIENT_EMAIL'),
      }),
    });
  }

  async subscribeToTopic(token: string | string[], topic: string) {
    await firebaseAdmin.messaging().subscribeToTopic(token, topic);
  }

  async unsubscribeFromTopic(token: string | string[], topic: string) {
    await firebaseAdmin.messaging().unsubscribeFromTopic(token, topic);
  }

  async sendNotification(
    deviceIds: Array<string>,
    payload: firebaseAdmin.messaging.MessagingPayload,
    silent: boolean,
    imageUrl?: string
  ) {
    if (deviceIds.length === 0) {
      throw new Error('You provide an empty device ids list!');
    }

    const body: firebaseAdmin.messaging.MulticastMessage = {
      tokens: deviceIds,
      data: payload?.data,
      notification: {
        title: payload?.notification?.title,
        body: payload?.notification?.body,
        ...(imageUrl ? { imageUrl } : {}),
      },
      apns: {
        payload: {
          aps: {
            sound: payload?.notification?.sound,
            contentAvailable: silent,
            mutableContent: true,
          },
        },
        ...(imageUrl ? { fcmOptions: { imageUrl } } : {}),
      },
      android: {
        priority: 'high',
        ttl: 60 * 60 * 24,
        notification: {
          sound: payload?.notification?.sound,
        },
      },
    };

    let result = null;
    let failureCount = 0;
    let successCount = 0;
    const failedDeviceIds = [];

    while (deviceIds.length) {
      try {
        result = await firebaseAdmin
          .messaging()
          .sendMulticast({ ...body, tokens: deviceIds.splice(0, 500) }, false);
        if (result.failureCount > 0) {
          const failedTokens = [];
          result.responses.forEach((resp: any, id: string) => {
            if (!resp.success) {
              failedTokens.push(deviceIds[id]);
            }
          });
          failedDeviceIds.push(...failedTokens);
        }
        failureCount += result.failureCount;
        successCount += result.successCount;
      } catch (error) {
        this.logger.error(error.message, error.stackTrace);
        throw error;
      }
    }

    return { failureCount, successCount, failedDeviceIds };
  }
}
