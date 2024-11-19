import { DateTime, DurationLike } from 'luxon';
import { TimeSpan } from '../enums';

export type TimeSpanType = {
  startOfTimeSpan: Date;
  endOfTimeSpan: Date;
  startOfPreviousTimeSpan: Date;
  endOfPreviousTimeSpan: Date;
};

export class DateHelper {
  static addToCurrent(duration: DurationLike): Date {
    const dt = DateTime.now();
    return dt.plus(duration).toJSDate();
  }

  static isAfterCurrent(date: Date): boolean {
    const d1 = DateTime.fromJSDate(date ?? new Date());
    const d2 = DateTime.now();
    return d2 > d1;
  }

  static startOfDay(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .startOf('day')
      .toJSDate();
  }

  static endOfDay(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .endOf('day')
      .toJSDate();
  }

  static isValidDate(date: Date): boolean {
    // set date format to accept
    const dateFormat = 'yyyy-MM-dd';
    // check if date is valid
    return DateTime.fromFormat(date.toString(), dateFormat).isValid;
  }

  static startOfWeek(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .startOf('week')
      .toJSDate();
  }

  static endOfWeek(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .endOf('week')
      .toJSDate();
  }

  static startOfMonth(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .startOf('month')
      .toJSDate();
  }

  static endOfMonth(date: Date): Date {
    return DateTime.fromJSDate(date ?? new Date())
      .endOf('month')
      .toJSDate();
  }

  static parseTimeSpanToDate(timeSpan?: TimeSpan): TimeSpanType {
    let t = timeSpan;

    let startOfTimeSpan: Date;
    let endOfTimeSpan: Date;

    let startOfPreviousTimeSpan: Date;
    let endOfPreviousTimeSpan: Date;

    if (!timeSpan) {
      t = TimeSpan.TODAY;
    }

    const today = new Date();

    switch (t) {
      case TimeSpan.TODAY: {
        startOfTimeSpan = DateHelper.startOfDay(today);
        endOfTimeSpan = DateHelper.endOfDay(today);

        // Get start and end of previous day
        startOfPreviousTimeSpan = DateTime.fromJSDate(startOfTimeSpan)
          .minus({ days: 1 })
          .toJSDate();
        endOfPreviousTimeSpan = DateHelper.endOfDay(startOfPreviousTimeSpan);
        break;
      }
      case TimeSpan.CURRENT_WEEK: {
        // Get start and end of current week
        startOfTimeSpan = DateHelper.startOfWeek(today);
        endOfTimeSpan = DateHelper.endOfWeek(today);

        // Subtract 7 days to get start and end of previous week
        startOfPreviousTimeSpan = DateTime.fromJSDate(startOfTimeSpan)
          .minus({ days: 7 })
          .toJSDate();

        endOfPreviousTimeSpan = DateHelper.endOfWeek(startOfPreviousTimeSpan);
        break;
      }
      case TimeSpan.CURRENT_MONTH: {
        // Get start and end of current month
        startOfTimeSpan = DateHelper.startOfMonth(today);
        endOfTimeSpan = DateHelper.endOfMonth(today);

        // Subtract 1 month to get start and end of previous month
        startOfPreviousTimeSpan = DateTime.fromJSDate(startOfTimeSpan)
          .minus({ months: 1 })
          .toJSDate();
        endOfPreviousTimeSpan = DateHelper.endOfMonth(startOfPreviousTimeSpan);
        break;
      }

      default:
        break;
    }

    return {
      startOfTimeSpan,
      endOfTimeSpan,
      startOfPreviousTimeSpan,
      endOfPreviousTimeSpan,
    };
  }
}
