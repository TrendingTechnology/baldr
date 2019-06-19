<template>
  <div class="seating-plan">
    <seat-placement v-for="seat of seats"
      :seat="seat"
      :key="seat.no"
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
    background-color: whitesmoke;
    border: 1px solid black;
    position: relative;
    box-sizing: border-box;
  }
</style>
