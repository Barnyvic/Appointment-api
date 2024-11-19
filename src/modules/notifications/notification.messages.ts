import { NotificationType } from '../../interfaces';
import { Utils } from '../../utils';

export const messages: {
  [key in NotificationType]: { title: string; content?: string };
} = {
  NEW_APPOINTMENT: {
    title: "You've got a new appointment request",
    content: `You have a new appointment request`,
  },
  PROFILE_UPDATE: {
    title: 'Your profile has been updated',
    content: 'Your profile has been updated',
  },
  VERIFY_PHONE: {
    title: '',
    content: `Hello, your RouteLift confirmation code is %s. This code will expire in 30 minutes.`,
  },
  RESET_PASSWORD: {
    title: '',
    content: `Hello, your RouteLift confirmation code is %s. This code will expire in 30 minutes.`,
  },
  VERIFY_EMAIL: {
    title: '',
    content: `Hello, your RouteLift confirmation code is %s. This code will expire in 30 minutes.`,
  },
  ONBOARDING: {
    title: '',
    content: '',
  },
  BOOKED_APPOINTMENT: {
    title: 'Your appointment has been booked',
    content: `Your appointment with %s for %s on %s at %s has been booked.`,
  },
  RESCHEDULED_APPOINTMENT: {
    title: 'Your appointment has been rescheduled',
    content: `Your appointment with %s for %s on %s at %s has been rescheduled.`,
  },
  CANCELLED_APPOINTMENT: {
    title: 'Your appointment has been cancelled',
    content: `Your appointment with %s for %s on %s at %s has been cancelled.`,
  },
  UPCOMING_APPOINTMENT: {
    title: 'Upcoming appointment reminder',
    content: `Your appointment with %s is scheduled for %s at %s.`,
  },
  DAILY_REMINDER: {
    title: 'Daily Appointment Reminder',
    content: `You have an appointment with %s today at %s.`,
  },
  RESCHEDULE_CONFIRMED: {
    title: 'Your reschedule has been confirmed',
    content: `Your appointment with %s for %s on %s at %s has been confirmed.`,
  },
  RESCHEDULE_REQUESTED: {
    title: 'Reschedule requested',
    content: `Your appointment with %s for %s on %s at %s has a reschedule request.`,
  },
  STAFF_CREATED: {
    title: 'New Staff Created',
    content: `A new staff member has been created with email: %s and password: %s.`,
  },
  WELCOME_NEW_STAFF: {
    title: 'Welcome to the Team!',
    content: `Your account has been created with email: %s and password: %s. You can change your password anytime.`,
  },
  APPOINTMENT_CONFIRMED: {
    title: 'Appointment Confirmed',
    content: `You have confirmed an appointment with %s for %s on %s at %s.`,
  },
};

export const getMessage = (
  type: NotificationType,
  metadata?: any
): {
  title: string;
  content: string;
} => {
  const d = messages[type];
  let content = d.content || '';

  const needsTrackingCode = [
    NotificationType.VERIFY_PHONE,
    NotificationType.RESET_PASSWORD,
    NotificationType.VERIFY_EMAIL,
  ];

  if (needsTrackingCode.includes(type)) {
    if (metadata?.trackingCode) {
      content = Utils.formatString(d.content, metadata.trackingCode);
    }
  }

  return {
    title: d.title,
    content: Utils.formatString(d.content, metadata),
  };
};
