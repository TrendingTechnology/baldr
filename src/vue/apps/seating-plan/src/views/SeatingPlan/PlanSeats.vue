<template>
  <div class="vc_plan_seats">
    <one-seat v-for="seat in seatPositions" :seat="seat" :key="seat.no" />
  </div>
</template>

<script lang="ts">
import ResizeObserver from 'resize-observer-polyfill'
import { Component, Vue, mapGetters } from '@bldr/vue-packages-bundler'

// Components
import OneSeat from './OneSeat.vue'

const resizeObserver = new ResizeObserver(entries => {
  const elHeader = document.querySelector('#app > header')
  // Startpage has no footer
  const elFooter = document.querySelector('#app > footer')
  const elPrintFooter = document.querySelector('#print-area > footer')
  const elPrintHeader = document.querySelector('#print-area > header')

  if (elHeader && elFooter && elPrintHeader && elPrintFooter) {
    const headerHeight = elHeader.clientHeight
    const footerHeight = elFooter.clientHeight
    const printHeaderHeight = elPrintHeader.clientHeight
    const printFooterHeight = elPrintFooter.clientHeight
    const windowHeight = window.innerHeight
    // To avoid scroll bars minus buffer
    const maxHeight =
      windowHeight -
      headerHeight -
      footerHeight -
      printHeaderHeight -
      printFooterHeight -
      10
    // DIN A 4 Landscape: width: 297 height: 210
    const aspectRatio = { width: 297, height: 210 }
    for (const entry of entries) {
      const height =
        (aspectRatio.height / aspectRatio.width) * entry.contentRect.width
      const element = <HTMLElement>entry.target
      if (height > maxHeight) {
        element.style.height = `${maxHeight}px`
      } else {
        element.style.height = `${height}px`
      }
    }
  }
})

@Component({
  components: {
    OneSeat
  },
  computed: mapGetters(['seatPositions'])
})
export default class PlanSeats extends Vue {
  mounted () {
    resizeObserver.observe(this.$el)
  }
}
</script>

<style lang="scss">
.vc_plan_seats {
  box-sizing: border-box;
  margin: 0 auto;
  position: relative;
  width: 100%;

  @media print {
    width: 100% !important;
    // Firefox
    height: 50em !important;
  }
}
</style>
