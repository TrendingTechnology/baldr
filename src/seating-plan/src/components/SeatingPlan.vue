<template>
  <div class="seating-plan">
    <seat-placement v-for="seat of seats"
      :no="seat.no"
      :person="seat.person"
      :x="seat.x"
      :y="seat.y"
      :key="seat.no"
      :width="seatWidth"
      :depth="seatDepth"
      />
  </div>
</template>

<script>
import SeatPlacement from './SeatPlacement.vue'

export default {
  name: 'SeatingPlan',
  components: {
    SeatPlacement
  },
  computed: {
    seats() {
      return this.$root.$data.seatingPlan.seats.seats
    },
    seatWidth() {
      return this.$root.$data.seatingPlan.seats.seatWidth
    },
    seatDepth() {
      return this.$root.$data.seatingPlan.seats.seatDepth
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
    height: 70.70707070vw;
    background-color: azure;
    border: 1px solid black;
    position: relative;
    box-sizing: border-box;
  }
</style>
