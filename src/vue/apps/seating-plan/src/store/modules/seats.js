class Seat {
  constructor (no, x, y) {
    this.no = no
    this.x = x
    this.y = y
  }

  toJSON () {
    return {
      x: this.x,
      y: this.y
    }
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
    const aisle = 0.05 * roomWidth
    this.dimension = {
      width: (roomWidth - aisle) / 8,
      depth: (roomDepth - (3 * aisle)) / 4
    }

    this.count = 32

    const blocks = [
      [[1, 2, 3, 4], [5, 6, 7, 8]],
      [[9, 10, 11, 12], [13, 14, 15, 16]],
      [[17, 18, 19, 20], [21, 22, 23, 24]],
      [[25, 26, 27, 28], [29, 30, 31, 32]]
    ]
    this.positions = this.calculatePositions(blocks, aisle)
  }

  calculatePositions (blocks, aisle) {
    const seats = {}
    let seatY = 0
    let seatX = 0
    for (const row of blocks) {
      for (const block of row) {
        for (const seatNo of block) {
          seats[seatNo] = new Seat(seatNo, seatX, seatY)
          seatX += this.dimension.width
        }
        seatX += aisle
      }
      seatY += this.dimension.depth + aisle
      seatX = 0
    }
    return seats
  }
}

const state = new InitState()

const getters = {
  seatByNo: (state) => (seatNo) => {
    return state.positions[seatNo]
  },
  seatPositions: (state) => {
    return state.positions
  },
  seats: (state) => {
    return state
  }
}

export default {
  InitState,
  state,
  getters
}
