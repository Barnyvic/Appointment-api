import { TermiiChannels } from 'src/shared/lib';

export enum NotificationType {
  NEW_APPOINTMENT = 'NEW_APPOINTMENT',
  PROFILE_UPDATE = 'PROFILE_UPDATE',
  VERIFY_PHONE = 'VERIFY_PHONE',
  RESET_PASSWORD = 'RESET_PASSWORD',
  VERIFY_EMAIL = 'VERIFY_EMAIL',
  ONBOARDING = 'ONBOARDING',
  BOOKED_APPOINTMENT = 'BOOKED_APPOINTMENT',
  RESCHEDULED_APPOINTMENT = 'RESCHEDULED_APPOINTMENT',
  CANCELLED_APPOINTMENT = 'CANCELLED_APPOINTMENT',
  UPCOMING_APPOINTMENT = 'UPCOMING_APPOINTMENT',
  DAILY_REMINDER = 'DAILY_REMINDER',
  RESCHEDULE_CONFIRMED = 'RESCHEDULE_CONFIRMED',
  RESCHEDULE_REQUESTED = 'RESCHEDULE_REQUESTED',
  STAFF_CREATED = 'STAFF_CREATED',
  WELCOME_NEW_STAFF = 'WELCOME_NEW_STAFF',
  APPOINTMENT_CONFIRMED = 'APPOINTMENT_CONFIRMED',
}

export type FindDriverToQueueType = {
  taskId: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export enum NotificationChannels {
  SMS = 'SMS',
  EMAIL = 'EMAIL',
  WHATSAPP = 'WHATSAPP',
  CALL = 'CALL',
}

export type NotificationMessageType = {
  recipient: string;
  route: TermiiChannels;
  message: string;
  type: NotificationChannels;
};

export type CreateNotificationType = {
  type: NotificationType;
  userId: string;
  notificationImage?: string;
  metadata?: any;
};
