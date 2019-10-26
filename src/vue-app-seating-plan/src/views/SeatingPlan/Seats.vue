<template>
  <div class="seating-plan">
    <one-seat
      v-for="seat in seatPositions"
      :seat="seat"
      :key="seat.no"
      />
  </div>
</template>

<script>
import ResizeObserver from 'resize-observer-polyfill'
import { mapGetters } from 'vuex'

// Components
import OneSeat from './OneSeat'

let resizeObserver = new ResizeObserver(entries => {
  console.log(entries)
  const elHeader = document.querySelector('#app > header')
  // Startpage has no footer
  const elFooter = document.querySelector('#app > footer')
  const elPrintFooter = document.querySelector('#print-area > footer')
  const elPrintHeader = document.querySelector('#print-area > header')

  if (elHeader && elFooter && elPrintHeader && elPrintFooter) {
    let headerHeight = elHeader.clientHeight
    let footerHeight = elFooter.clientHeight
    let printHeaderHeight = elPrintHeader.clientHeight
    let printFooterHeight = elPrintFooter.clientHeight
    let windowHeight = window.innerHeight
    // To avoid scroll bars minus buffer
    let maxHeight = windowHeight - headerHeight - footerHeight - printHeaderHeight - printFooterHeight - 10
    // DIN A 4 Landscape: width: 297 height: 210
    let aspectRatio = { width: 297, height: 210 }
    for (let entry of entries) {
      let height = aspectRatio.height / aspectRatio.width * entry.contentRect.width
      if (height > maxHeight) {
        entry.target.style.height = `${maxHeight}px`
        // let maxWidth = aspectRatio.width / aspectRatio.height * maxHeight
        // entry.target.style.width = `${maxWidth}px`
      } else {
        entry.target.style.height = `${height}px`
      }
    }
  }
})

export default {
  name: 'PlanSeats',
  components: {
    OneSeat
  },
  computed: mapGetters([
    'seatPositions'
  ]),
  mounted () {
    resizeObserver.observe(this.$el)
  }
}
</script>

<style lang="scss" scoped>
  .seating-plan {
    width: 100%;
    position: relative;
    box-sizing: border-box;
    margin: 0 auto;
  }

  @media print {
    .seating-plan {
      width: 100% !important;
      // Firefox
      height: 35em !important;
    }
  }
</style>
