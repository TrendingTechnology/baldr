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

class Person {
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

  add (person) {
    // grade
    if (!this.list.hasOwnProperty(person.grade)) {
      this.list[person.grade] = {}
    }

    // lastName
    if (!this.list[person.grade].hasOwnProperty(person.lastName)) {
      this.list[person.grade][person.lastName] = {}
    }

    // firstName
    if (this.list[person.grade][person.lastName].hasOwnProperty(person.firstName)) {
      throw new Error(`Person already exists ${person.firstName} ${person.lastName} ${person.grade}`)
    }

    this.list[person.grade][person.lastName][person.firstName] = person
  }

  flattenList () {
    let people = []
    for (let grade of Object.keys(this.list).sort()) {
      for (let lastName of Object.keys(this.list[grade]).sort()) {
        for (let firstName of Object.keys(this.list[grade][lastName]).sort()) {
          people.push(this.list[grade][lastName][firstName])
       }
      }
    }
    return people
  }
}

let people = new People()
for (let personFromList of peopleList) {
  people.add(new Person(personFromList.firstName, personFromList.lastName, personFromList.grade))
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
      people: people.flattenList()
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
