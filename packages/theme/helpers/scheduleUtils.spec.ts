import { getTodaySchedule } from './scheduleUtils';
import { describe, expect, it } from '@jest/globals';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

const schedule = {
  fulfillmentLocationId: '5e4a9af1-f066-42bf-ab33-c6284042587a',
  openingHours: [
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT10H',
          endingTime: 'PT18H'
        }
      ],
      day: 'Monday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT10H',
          endingTime: 'PT18H'
        }
      ],
      day: 'Tuesday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT0S',
          endingTime: 'PT9H'
        },
        {
          beginingTime: 'PT10H',
          endingTime: 'P1D'
        }
      ],
      day: 'Wednesday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT0S',
          endingTime: 'PT9H'
        },
        {
          beginingTime: 'PT10H',
          endingTime: 'P1D'
        }
      ],
      day: 'Thursday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT10H',
          endingTime: 'PT21H'
        }
      ],
      day: 'Friday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT9H',
          endingTime: 'PT17H'
        }
      ],
      day: 'Saturday',
      isOpenedAllDay: false
    },
    {
      isClosed: false,
      openingTimes: [
        {
          beginingTime: 'PT10H',
          endingTime: 'PT17H'
        }
      ],
      day: 'Sunday',
      isOpenedAllDay: false
    }
  ],
  openingHourExceptions: [
    {
      id: 'c16a660d79e44155abb37c92d81b06c6',
      name: 'test1',
      isClosed: true,
      openingTime: {
        beginingTime: 'PT0S',
        endingTime: 'P1D'
      },
      startDate: '2022-08-03T00:00:00.0000000Z',
      endDate: '2022-08-03T00:00:00.0000000Z',
      isRecurrent: false
    },
    {
      id: '22391d42fda64021a5911b43c2ce30a6',
      name: 'test',
      isClosed: false,
      openingTime: {
        beginingTime: 'PT0S',
        endingTime: 'PT17H'
      },
      startDate: '2022-08-05T00:00:00.0000000Z',
      endDate: '2022-08-05T00:00:00.0000000Z',
      isRecurrent: true
    }
  ],
  scheduleType: 'OpeningHours'
};

describe('Schedule', () => {
  test('Check opening time', () => {
    // Arrange
    // Tuesday
    const now = dayjs.tz('2022-08-02 11:00', 'America/New_York').toDate();
    const timezoneName = 'Eastern Standard Time';
    // Act
    const todaySchedule = getTodaySchedule(now, schedule, timezoneName);

    // Assert
    expect(todaySchedule.isOpen).toBe(true);
  });

  test('Check closed time', () => {
    // Arrange
    // Tuesday
    const now = dayjs.tz('2022-08-02 7:00', 'America/New_York').toDate();
    const timezoneName = 'Eastern Standard Time';

    // Act
    const todaySchedule = getTodaySchedule(now, schedule, timezoneName);

    // Assert
    expect(todaySchedule.isOpen).toBe(false);
  });


  test('Check ends at 24:00 time', () => {
    // Arrange
    // Thursday
    const now = dayjs.tz('2022-08-04 15:00', 'America/New_York').toDate();
    const timezoneName = 'Eastern Standard Time';

    // Act
    const todaySchedule = getTodaySchedule(now, schedule, timezoneName);

    // Assert
    expect(todaySchedule.isOpen).toBe(true);
  });

  test('Check exception closed', () => {
    // Arrange
    const now = dayjs.tz('2022-08-03 15:00', 'America/New_York').toDate();
    const timezoneName = 'Eastern Standard Time';

    // Act
    const todaySchedule = getTodaySchedule(now, schedule, timezoneName);

    // Assert
    expect(todaySchedule.isOpen).toBe(false);
  });

  test('Check exception open', () => {
    // Arrange
    const now = dayjs.tz('2022-08-05 5:00', 'America/New_York').toDate();
    const timezoneName = 'Eastern Standard Time';

    // Act
    const todaySchedule = getTodaySchedule(now, schedule, timezoneName);

    // Assert
    expect(todaySchedule.isOpen).toBe(true);
  });



  
});
