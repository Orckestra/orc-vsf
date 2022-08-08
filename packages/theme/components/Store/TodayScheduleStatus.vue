<template>
  <div class="store-schedule" v-if="schedule">
    <div v-if="isOpenedAllDay">{{ $t('Open all day') }}</div>
    <div v-else>
      <span>{{ $t('Open hours') }}:</span>
      <strong v-for="(item, index) in openingTimes" :key="index"> {{ item.beginingTime.format('HH:mm') }}-{{ item.endingTime.format('HH:mm') }} </strong>
      <span v-if="isOpen" class="color-primary sf-badge">{{ $t('Open') }}</span>
      <span v-else class="color-danger sf-badge">{{ $t('Closed') }}</span>
    </div>
  </div>
</template>

<script>
import { getTodaySchedule } from '~/helpers/scheduleUtils';

export default {
  name: 'TodayScheduleStatus',
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
