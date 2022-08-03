<template>
  <div class="store-schedule" v-if="schedule">
    <div v-if="isOpenedAllDay">Open 00:00-24:00</div>
    <div v-else>
      <span v-if="isOpen" class="open">{{ $t('Open') }}</span>
      <span v-else class="closed">{{ $t('Closed') }}</span>
      <span v-for="item in openingTimes" :key="item"> {{ item.beginingTime.format('HH:mm') }}-{{ item.endingTime.format('HH:mm') }} </span>
    </div>
  </div>
</template>

<script>
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';
import { getTimeZoneByName, daysOfWeek } from '~/utils/daytimeHelper';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export default {
  name: 'StoreSchedule',
  props: {
    schedule: {
      type: Object,
      default: null
    },
    timezoneName: {
      type: String,
      default: null
    }
  },
  setup({schedule, timezoneName}) {
    const timezone = getTimeZoneByName(timezoneName);
    const now = dayjs().tz(timezone);
    const today = now.startOf('day');
    const dayOfWeek = daysOfWeek[now.day()];
    const openingHours = schedule?.openingHours?.find(o => o.day === dayOfWeek);

    const openingTimes = openingHours.openingTimes?.map(time => {
      const beginingTime = today.add(dayjs.duration(time.beginingTime));
      const endingTime = today.add(dayjs.duration(time.endingTime));
      return {
        beginingTime,
        endingTime
      };
    });
    const isOpen = openingHours.isOpenedAllDay || (!openingHours.isClosed && openingTimes?.some(
      time => now.isAfter(time.beginingTime) && now.isBefore(time.endingTime)
    ));

    return {
      isOpen,
      isOpenedAllDay: openingHours.isOpenedAllDay,
      openingTimes
    };
  }
};
</script>

<style lang="scss" scoped>
.store-schedule {
  .open {
    color: var(--_c-green-primary);
  }
  .closed {
    color: var(--_c-red-primary);
  }
}
</style>
