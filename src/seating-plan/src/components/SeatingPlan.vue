<template>
  <section class="seating-plan">
    <one-seat
      v-for="seat in seatPositions"
      :seat="seat"
      :key="seat.no"
      />
  </section>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'
import { mapGetters } from 'vuex'

// Components
import OneSeat from './OneSeat.vue'

let resizeObserver = new ResizeObserver(entries => {
  const elHeader = document.querySelector('header')
  // Startpage has no footer
  const elFooter = document.querySelector('footer')
  if (elHeader && elFooter) {
    let headerHeight = elHeader.clientHeight
    let footerHeight = elFooter.clientHeight
    let windowHeight = window.innerHeight
    // To avoid scroll bars minus buffer
    let maxHeight = windowHeight - headerHeight - footerHeight - 10
    // DIN A 4 Landscape: width: 297 height: 210
    let aspectRatio = { width: 297, height: 210 }
    for (let entry of entries) {
      let height = aspectRatio.height / aspectRatio.width * entry.contentRect.width
      if (height > maxHeight) {
        entry.target.style.height = `${maxHeight}px`
        let maxWidth = aspectRatio.width / aspectRatio.height * maxHeight
        entry.target.style.width = `${maxWidth}px`
      } else {
        entry.target.style.height = `${height}px`
      }
    }
  }
})

export default {
  name: 'SeatingPlan',
  components: {
    OneSeat
  },
  computed: mapGetters(['seatPositions']),
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
