<template>
<div class="seating-plan">
<Seat v-for="seat in seats"
  v-bind:number="seat.number"
  v-bind:firstName="seat.firstName"
  v-bind:lastName="seat.lastName"
  v-bind:key="seat.number"
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
  props: ['seats']
}
</script>

<style scoped>
</style>
