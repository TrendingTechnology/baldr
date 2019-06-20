<template>
  <div class="seating-plan">
    <one-seat v-for="seat in seats"
      :seat="seat"
      :key="seat.no"
      />
  </div>
</template>

<script>
import OneSeat from './OneSeat.vue'
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlan',
  components: {
    OneSeat
  },
  computed: {
    seats() {
      return dataStore.getSeats()
    }
  }
}
</script>

<style scoped>
/* DIN A 4 Landscape: width: 297 height: 210
  (210 / 297) * 100 = 70.707070
*/
  .seating-plan {
    width: 100%;
    height: 96vh;
    position: relative;
    box-sizing: border-box;
    margin: 2vh;
  }
</style>
