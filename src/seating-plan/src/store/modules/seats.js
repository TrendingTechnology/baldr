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
class InitState {
  constructor () {
    const roomWidth = 100 // %
    const roomDepth = 100 // %
    this.aisle = 0.05 * roomWidth
    this.dimension = {
      width: (roomWidth - this.aisle) / 8,
      depth: (roomDepth - (3 * this.aisle)) / 4
    }

    this.count = 32

    this.seatBlocks = [
      [[1, 2, 3, 4], [5, 6, 7, 8]],
      [[9, 10, 11, 12], [13, 14, 15, 16]],
      [[17, 18, 19, 20], [21, 22, 23, 24]],
      [[25, 26, 27, 28], [29, 30, 31, 32]]
    ]
    this.positions = this.calculatePositions()
  }

  calculatePositions () {
    const seats = {}
    let seatY = 0
    let seatX = 0
    for (const row of this.seatBlocks) {
      for (const block of row) {
        for (const seatNo of block) {
          seats[seatNo] = new Seat(seatNo, seatX, seatY)
          seatX += this.dimension.width
        }
        seatX += this.aisle
      }
      seatY += this.dimension.depth + this.aisle
      seatX = 0
    }
    return seats
  }
}

const state = new InitState()

const getters = {
  seats: (state) => {
    return state
  },
  seatPositions: (state) => {
    return state.positions
  },
  seatByNo: (state) => (seatNo) => {
    return state.positions[seatNo]
  }
}

export default {
  InitState,
  state,
  getters
}
