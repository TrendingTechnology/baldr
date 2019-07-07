class Seat {
  constructor (no, x, y) {
    this.no = no
    this.x = x
    this.y = y
  }
}

/**
 * 25 26 27 28    29 30 31 32
 *
 * 17 18 19 20    21 22 23 24
 *
 * 9  10 11 12    13 14 15 16
 *
 * 1  2  3  4     5  6  7  8
 */
class SeatingPlanLayout {
  constructor () {
    let roomWidth = 100 // %
    let roomDepth = 100 // %
    this.aisle = 0.05 * roomWidth
    this.seatWidth = (roomWidth - this.aisle) / 8
    this.seatDepth = (roomDepth - (3 * this.aisle)) / 4

    this.seatCount = 32

    this.seatBlocks = [
      [[1, 2, 3, 4], [5, 6, 7, 8]],
      [[9, 10, 11, 12], [13, 14, 15, 16]],
      [[17, 18, 19, 20], [21, 22, 23, 24]],
      [[25, 26, 27, 28], [29, 30, 31, 32]]
    ]
  }

  getSeatPositions () {
    let seats = {}
    let seatY = 0
    let seatX = 0
    for (let row of this.seatBlocks) {
      for (let block of row) {
        for (let seatNo of block) {
          seats[seatNo] = new Seat(seatNo, seatX, seatY)
          seatX += this.seatWidth
        }
        seatX += this.aisle
      }
      seatY += this.seatDepth + this.aisle
      seatX = 0
    }
    return seats
  }
}

const seatingPlanLayout = new SeatingPlanLayout()

const state = {
  count: seatingPlanLayout.seatCount,
  dimension: {
    width: seatingPlanLayout.seatWidth,
    depth: seatingPlanLayout.seatDepth
  },
  positions: seatingPlanLayout.getSeatPositions()
}

const getters = {
  getSeats: (state) => {
    return state
  },
  getSeatPositions: (state) => {
    return state.positions
  },
  getSeatByNo: (state) => (seatNo) => {
    return state.positions[seatNo]
  }
}

export default {
  state,
  getters
}
