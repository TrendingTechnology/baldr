import Vue from 'vue'
import App from './App.vue'

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

class Seat {
  constructor (no, x, y, person = {}) {
    this.no = no
    this.x = x
    this.y = y
    this.person = person
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
class SeatingPlan {
  constructor () {
    let roomWidth = 100 // %
    let roomDepth = 100 // %
    let aisle = 0.10 * roomWidth
    this.seatWidth = (roomWidth - aisle) / 8
    this.seatDepth = (roomDepth - (3 * aisle)) / 4

    let seatBlocks = [
      [[1, 2, 3, 4], [5, 6, 7, 8]],
      [[9, 10, 11, 12], [13, 14, 15, 16]],
      [[17, 18, 19, 20], [21, 22, 23, 24]],
      [[25, 26, 27, 28], [29, 30, 31, 32]],
    ]

    this.seats = {}
    let seatY = 0
    let seatX = 0
    for (let row of seatBlocks) {
      for (let block of row) {
        for (let seatNo of block) {
          this.seats[seatNo] = new Seat(seatNo, seatX, seatY)
          seatX += this.seatWidth
        }
        seatX += aisle
      }
      seatY += this.seatDepth + aisle
      seatX = 0
    }
  }
}

let peopleList = [
  { firstName: 'Wolfgang Amadeus', lastName: 'Mozart', grade: 'Classic' },
  { firstName: 'Joseph', lastName: 'Haydn', grade: 'Classic' },
  { firstName: 'Ludwig van', lastName: 'Beethoven', grade: 'Classic' },
  { firstName: 'Johann Sebastian', lastName: 'Bach', grade: 'Baroque' },
  { firstName: 'Georg Friedrich', lastName: 'Händel', grade: 'Baroque' }
]

let people = new People()
for (let personFromList of peopleList) {
  people.add(new Person(personFromList.firstName, personFromList.lastName, personFromList.grade))
}

let seatingPlan = new SeatingPlan()

Vue.config.productionTip = false

new Vue({
  data: function () {
    return {
      seatingPlan: seatingPlan,
      people: people
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')
