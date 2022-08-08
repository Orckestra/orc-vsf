import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';
import { getTimeZoneByName, daysOfWeek } from './daytimeUtils';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getTodaySchedule = (now: Date, schedule: any, timezoneName: string): any => {
  const timezone = getTimeZoneByName(timezoneName);

  const day = dayjs(now).tz(timezone);
  const today = day.startOf('day');
  const dayOfWeek = daysOfWeek[day.day()];
  const openingHours = schedule?.openingHours?.find((o) => o.day === dayOfWeek);
  const parseTime = (time: string) => today.add(dayjs.duration(time));
  const parseDate = (date, isRecurrent) => {
    const d = dayjs.tz(date, timezone);
    return isRecurrent ? d.year(today.year()) : d;
  };

  if (schedule.openingHourExceptions) {
    for (let i = 0; i < schedule.openingHourExceptions.length; i++) {
      const exception = schedule.openingHourExceptions[i];
      const startDate = parseDate(exception.startDate, exception.isRecurrent);
      const endDate = parseDate(exception.endDate, exception.isRecurrent).add(1, 'day');

      if (day.isAfter(startDate) && day.isBefore(endDate)) {
        // eslint-disable-next-line max-depth
        if (exception.isClosed) {

          return {
            isOpen: false,
            openingTimes: []
          };
        } else {
          const beginingTime = parseTime(exception.openingTime?.beginingTime);
          const endingTime = parseTime(exception.openingTime?.endingTime);

          // eslint-disable-next-line max-depth
          if (day.isAfter(beginingTime) && day.isBefore(endingTime)) {
            return {
              isOpen: true,
              openingTimes: [{ beginingTime, endingTime }]
            };
          }
        }
      }
    }
  }

  const openingTimes = openingHours?.openingTimes?.map((time) => {
    const beginingTime = parseTime(time.beginingTime);
    const endingTime = parseTime(time.endingTime);
    return {
      beginingTime,
      endingTime
    };
  });

  const isOpen =
    openingHours?.isOpenedAllDay ||
    (!openingHours?.isClosed && openingTimes?.some((time) => day.isAfter(time.beginingTime) && day.isBefore(time.endingTime)));

  return {
    isOpen,
    isOpenedAllDay: openingHours?.isOpenedAllDay,
    openingTimes
  };
};
