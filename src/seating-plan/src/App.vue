<template>
  <div id="app">
    <SeatingPlan :seats="seats" :seatDepth="seatDepth" :seatWidth="seatWidth"/>
    <PeopleList :people="people"/>
  </div>
</template>

<script>
import Seat from './components/Seat.vue'
import SeatingPlan from './components/SeatingPlan.vue'
import PeopleList from './components/PeopleList.vue'

let peopleList = [
  { firstName: 'Wolfgang Amadeus', lastName: 'Mozart', grade: 'Classic' },
  { firstName: 'Joseph', lastName: 'Haydn', grade: 'Classic' },
  { firstName: 'Ludwig van', lastName: 'Beethoven', grade: 'Classic' },
  { firstName: 'Johann Sebastian', lastName: 'Bach', grade: 'Baroque' },
  { firstName: 'Georg Friedrich', lastName: 'Händel', grade: 'Baroque' }
]

class Human {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName
    this.lastName = lastName
    this.grade = grade
  }

  get sortString () {
    return `${this.grade}: ${this.lastName}, ${this.firstName}`
  }
}

class People {
  constructor () {
    this.list = {}
  }

  add (human) {
    // grade
    if (!this.list.hasOwnProperty(human.grade)) {
      this.list[human.grade] = {}
    }

    // lastName
    if (!this.list[human.grade].hasOwnProperty(human.lastName)) {
      this.list[human.grade][human.lastName] = {}
    }

    // firstName
    if (this.list[human.grade][human.lastName].hasOwnProperty(human.firstName)) {
      throw new Error(`Human already exists ${human.firstName} ${human.lastName} ${human.grade}`)
    }

    this.list[human.grade][human.lastName][human.firstName] = human
  }
}

let people = new People()
for (let humanFromList of peopleList) {
  people.add(new Human(humanFromList.firstName, humanFromList.lastName, humanFromList.grade))
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
function createSeats () {
  let roomWidth = 100 // %
  let roomDepth = 100 // %
  let aisle = 0.10 * roomWidth
  let seatWidth = (roomWidth - aisle) / 8
  let seatDepth = (roomDepth - (3 * aisle)) / 4

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
  return {
    seats: seats,
    seatWidth: seatWidth,
    seatDepth: seatDepth
  }
}

let seats = createSeats()

export default {
  name: 'app',
  components: {
    Seat, SeatingPlan, PeopleList
  },
  data: function () {
    return {
      seats: seats.seats,
      seatDepth: seats.seatDepth,
      seatWidth: seats.seatWidth,
      people: peopleList
    }
  }
}
</script>

<style>
body {
  margin: 2px;
}
#app {
  display: flex;
}
.people-list {
  flex-shrink: 2;
}
</style>
