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
import {getTodaySchedule} from '~/helpers/scheduleUtils';

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

    const now = new Date();
    const todayShedule = getTodaySchedule(now, schedule, timezoneName);
    return {...todayShedule};
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
