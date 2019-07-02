<template>
  <div class="seating-plan" @onresize="eventListenerOnresize">
    <one-seat v-for="seat in seats"
      :seat="seat"
      :key="seat.no"
      />
  </div>
</template>

<script>
import OneSeat from './OneSeat.vue'
import dataStore from '../data-store.js'
import ResizeObserver from 'resize-observer-polyfill'

let resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    // DIN A 4 Landscape: width: 297 height: 210
    // (210 / 297) * 100 = 70.707070
    entry.target.style.height = 0.70707070 * entry.contentRect.width + 'px'
  }
})

export default {
  name: 'SeatingPlan',
  components: {
    OneSeat
  },
  computed: {
    seats () {
      return dataStore.getSeats()
    }
  },
  methods: {
    eventListenerOnresize (event) {
      console.log(event)
    }
  },
  mounted () {
    resizeObserver.observe(this.$el)
  }
}
</script>

<style scoped>

  .seating-plan {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    margin: 2vh;
  }
</style>
