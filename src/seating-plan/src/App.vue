<template>
  <div id="app">
    <SeatingPlan :seats="seats" :seatDepth="seatDepth" :seatWidth="seatWidth"/>
  </div>
</template>

<script>
import Seat from './components/Seat.vue'
import SeatingPlan from './components/SeatingPlan.vue'

let roomWidth = 100 // %
let roomDepth = 100 // %
let aisle = 0.10 * roomWidth
let seatWidth = (roomWidth - aisle) / 8
let seatDepth = (roomDepth - (3 * aisle)) / 4

/**
 * 25 26 27 28    29 30 31 32
 *
 * 17 18 19 20    21 22 23 24
 *
 * 9  10 11 12    13 14 15 16
 *
 * 1  2  3  4     5  6  7  8
 */

let seatBlocks = [
  [[1, 2, 3, 4], [5, 6, 7, 8]],
  [[9, 10, 11, 12], [13, 14, 15, 16]],
  [[17, 18, 19, 20], [21, 22, 23, 24]],
  [[25, 26, 27, 28], [29, 30, 31, 32]],
]

let seats = []
let seatY = 0
let seatX = 0
for (let row of seatBlocks) {
  for (let block of row) {
    for (let seatNo of block) {
      seats.push({ no: seatNo, x: seatX, y: seatY })
      seatX += seatWidth
    }
    seatX += aisle
  }
  seatY += seatDepth + aisle
  seatX = 0
}

export default {
  name: 'app',
  components: {
    Seat, SeatingPlan
  },
  data: function () {
    return {
      seats: seats,
      seatDepth: seatDepth,
      seatWidth: seatWidth
    }
  }
}
</script>

<style>
body {
  margin: 2px;
}
</style>
