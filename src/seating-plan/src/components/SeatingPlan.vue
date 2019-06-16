<template>
  <div class="seating-plan">
    <Seat v-for="seat in seats"
      :no="seat.no"
      :firstName="seat.firstName"
      :lastName="seat.lastName"
      :x="seat.x"
      :y="seat.y"
      :key="seat.no"
      :width="seatWidth"
      :depth="seatDepth"
      />
  </div>
</template>

<script>
import Seat from './Seat.vue'

export default {
  name: 'SeatingPlan',
  components: {
    Seat
  },
  props: {
    seats: Array,
    seatWidth: Number,
    seatDepth: Number
  }
}
</script>


<style scoped>
/* DIN A 4 Landscape: width: 297 height: 210
  (210 / 297) * 100 = 70.707070
*/
  .seating-plan {
    width: 100%;
    height: 70.70707070vw;
    background-color: azure;
    border: 1px solid black;
    position: relative;
    box-sizing: border-box;
  }
</style>
