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
  let headerHeight = document.querySelector('header').clientHeight
  let footerHeight = document.querySelector('footer').clientHeight
  let windowHeight = window.innerHeight
  // To avoid scroll bars minus buffer
  let maxHeight = windowHeight - headerHeight - footerHeight - 10
  // DIN A 4 Landscape: width: 297 height: 210
  let aspectRatio = { width: 297, height: 210 }
  for (let entry of entries) {
    let height = aspectRatio.height / aspectRatio.width * entry.contentRect.width
    if (height > maxHeight) {
      entry.target.style.height = `${maxHeight}px`
    } else {
      entry.target.style.height = `${height}px`
    }
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
  }
</style>
