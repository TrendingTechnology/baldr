import Vue from 'vue'
import App from './App.vue'
import dataStore from './data-store.js'
import VueRouter from 'vue-router'

class Person {
  constructor (firstName, lastName, grade) {
    this.firstName = firstName
    this.lastName = lastName
    this.grade = grade
    this.placed = false
    this.seatNo = 0
  }

  get id () {
    return `${this.grade}: ${this.lastName}, ${this.firstName}`
  }
}

class People {
  constructor () {
    this.list = {}
  }

  getPersonById (id) {
    let match = id.match(/(.+): (.+), (.+)/)
    return this.getPerson(match[3], match[2], match[1])
  }

  getPerson (firstName, lastName, grade) {
    return this.list[grade][lastName][firstName]
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

  grades () {
    return Object.keys(this.list).sort()
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
class Seats {
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

class SeatingPlan {
  constructor (people, seats) {
    this.people = people
    this.nonePerson = new Person('', '', '')
    this.seats = seats
  }
}

// https://realnamecreator.alexjonas.de/?l=de#
let peopleList = [
  // 1b
  { firstName: 'Nicolas', lastName: 'Wagenknecht', grade: '1b' },
  { firstName: 'Cornelia', lastName: 'Fierek', grade: '1b' },
  { firstName: 'Volker', lastName: 'Englisch', grade: '1b' },
  { firstName: 'Hannah', lastName: 'Fenske', grade: '1b' },
  { firstName: 'Alena', lastName: 'Röhner', grade: '1b' },
  { firstName: 'Katrin', lastName: 'Knospe', grade: '1b' },
  { firstName: 'Angelina', lastName: 'Hüttner', grade: '1b' },
  // 10a
  { firstName: 'Tina', lastName: 'Gaudig', grade: '10a' },
  { firstName: 'Maurice', lastName: 'Grün', grade: '10a' },
  { firstName: 'Alex', lastName: 'Kögel', grade: '10a' },
  { firstName: 'Christine', lastName: 'Stremlau', grade: '10a' },
  { firstName: 'Marlene', lastName: 'Thiem', grade: '10a' },
  { firstName: 'Julius', lastName: 'Bremer', grade: '10a' }
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
  // { firstName: '', lastName: '', grade: '' },
]

let people = new People()
for (let personFromList of peopleList) {
  people.add(new Person(personFromList.firstName, personFromList.lastName, personFromList.grade))
}

let seats = new Seats()

let seatingPlan = new SeatingPlan(people, seats)

for (let personFromList of peopleList) {
  dataStore.addPerson(personFromList.firstName, personFromList.lastName, personFromList.grade)
}

dataStore.syncData()

Vue.config.productionTip = false

Vue.use(VueRouter)

new Vue({
  data: function () {
    return {
      seatingPlan: seatingPlan,
      data: dataStore.data
    }
  },
  render: function (h) { return h(App) }
}).$mount('#app')
