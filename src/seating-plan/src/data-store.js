/**
 * @module @bldr/seating-plan/data-store
 */

import Vue from 'vue'

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
    this.aisle = 0.10 * roomWidth
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
          seats[seatNo] = { no: seatNo, x: seatX, y: seatY }
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

/**
 * @see {@link https://stackoverflow.com/a/38641281}
 */
function naturalSort (a, b) {
  return a.localeCompare(b, 'de', { numeric: true, sensitivity: 'base' })
}

const seatingPlanLayout = new SeatingPlanLayout()

const dataStore = {
  data: {
    currentGrade: '',
    currentSeat: null,
    showModalPersonSelect: false,
    persons: {},
    grades: [],
    seats: {
      count: seatingPlanLayout.seatCount,
      dimension: {
        width: seatingPlanLayout.seatWidth,
        depth: seatingPlanLayout.seatDepth
      },
      positions: seatingPlanLayout.getSeatPositions()
    },
    plans: {},
    jobs: []
  },
  getData () {
    return this.data
  },
  addPerson (firstName, lastName, grade) {
    // grade
    if (!this.data.persons.hasOwnProperty(grade)) {
      Vue.set(this.data.persons, grade, {})
    }

    // lastName
    if (!this.data.persons[grade].hasOwnProperty(lastName)) {
      Vue.set(this.data.persons[grade], lastName, {})
    }

    // firstName
    if (this.data.persons[grade][lastName].hasOwnProperty(firstName)) {
      throw new Error(`Person already exists ${firstName} ${lastName} ${grade}`)
    }

    Vue.set(this.data.persons[grade][lastName], firstName, {
      id: `${grade}: ${lastName}, ${firstName}`,
      firstName: firstName,
      lastName: lastName,
      grade: grade,
      seatNo: 0,
      placed: false
    })

    // Add grade to grade list.
    if (!this.data.grades[grade]) {
      Vue.set(this.data.grades, grade, {
        name: grade,
        personsCount: 0,
        placed: 0
      })
    }
    this.data.grades[grade].personsCount += 1
  },
  getPersons (grade = null) {
    let persons = []
    if (grade) {
      for (let lastName of Object.keys(this.data.persons[grade]).sort()) {
        for (let firstName of Object.keys(this.data.persons[grade][lastName]).sort()) {
          persons.push(this.data.persons[grade][lastName][firstName])
        }
      }
    } else {
      for (let grade of Object.keys(this.data.persons).sort()) {
        for (let lastName of Object.keys(this.data.persons[grade]).sort()) {
          for (let firstName of Object.keys(this.data.persons[grade][lastName]).sort()) {
            persons.push(this.data.persons[grade][lastName][firstName])
          }
        }
      }
    }
    return persons
  },
  getPerson (firstName, lastName, grade) {
    return this.data.persons[grade][lastName][firstName]
  },
  getPersonById (id) {
    let match = id.match(/(.+): (.+), (.+)/)
    return this.getPerson(match[3], match[2], match[1])
  },
  getPersonBySeatNo (no) {
    let personId = this.data.plans[this.data.currentGrade][no]
    if (personId) {
      return this.getPersonById(personId)
    } else {
      return {}
    }
  },
  getSeats () {
    return this.data.seats.positions
  },
  getGrades () {
    let grades = Object.keys(this.data.grades)
    return grades.sort(naturalSort)
  },
  getCurrentGrade () {
    return this.data.currentGrade
  },
  setCurrentGrade (grade) {
    this.data.currentGrade = grade
  },
  setCurrentSeat (seatNo) {
    this.data.currentSeat = seatNo
  },
  initPlan (grade) {
    let plans = this.data.plans
    if (!plans.hasOwnProperty(grade)) {
      Vue.set(this.data.plans, grade, {})
    }
    for (let no = 1; no <= this.data.seats.count; no++) {
      if (!plans[grade].hasOwnProperty(no)) {
        Vue.set(this.data.plans[grade], no, '')
      }
    }
  },
  placePersonById (no, id) {
    let plan = this.data.plans[this.data.currentGrade]
    let person = this.getPersonById(id)
    let grade = this.getCurrentGrade()
    // Replace a already placed person and remove it from the plan.
    let replacedPersonId = plan[no]
    if (replacedPersonId) {
      let replacedPerson = this.getPersonById(replacedPersonId)
      replacedPerson.seatNo = 0
    }
    // Update placed counter
    // Decrease counter when one person is dragged over another person.
    if (replacedPersonId && person.seatNo) {
      this.data.grades[grade].placed -= 1
    // Increase placed counter only if person had not yet a seat.
    } else if (!person.seatNo) {
      this.data.grades[grade].placed += 1
    }

    // Move the same person to another seat. Free the previously taken seat.
    if (person.seatNo) {
      plan[person.seatNo] = ''
    }

    // Place the person.
    plan[no] = id
    person.seatNo = no
  },
  syncData () {
    for (let grade of this.getGrades()) {
      this.initPlan(grade)
    }
  },
  removePersonFromSeat (personId, seatNo) {
    let person = this.getPersonById(personId)
    person.seatNo = 0
    let grade = this.getCurrentGrade()
    this.data.plans[grade][seatNo] = ''
    this.data.grades[grade].placed -= 1
  },
  importData (jsonString) {
    let newData = JSON.parse(jsonString)
    let reactiveData = Vue.observable(newData)
    Vue.set(this, 'data', reactiveData)
    console.log(this.data)
  },
  createTestData () {
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
      { firstName: 'Julius', lastName: 'Bremer', grade: '10a' },
      { firstName: 'Inga', lastName: 'Hochstetter', grade: '10a' },
      { firstName: 'Roswitha', lastName: 'Gscheidle', grade: '10a' },
      { firstName: 'Lothar', lastName: 'Schöttler', grade: '10a' },
      { firstName: 'Axel', lastName: 'Göpfert', grade: '10a' },
      { firstName: 'Mike', lastName: 'Saalbach', grade: '10a' },
      { firstName: 'Nicholas', lastName: 'Enzmann', grade: '10a' },
      { firstName: 'Karin', lastName: 'Beilig', grade: '10a' },
      { firstName: 'Susanne', lastName: 'Delfs', grade: '10a' },
      { firstName: 'Waldemar', lastName: 'Tischer', grade: '10a' },
      { firstName: 'Karl-Heinz', lastName: 'Bandlow', grade: '10a' },
      { firstName: 'Katharina', lastName: 'Weigert', grade: '10a' },
      { firstName: 'Ulrike', lastName: 'Lukin', grade: '10a' },
      { firstName: 'Thorsten', lastName: 'Stüttem', grade: '10a' },
      // Q11
      { firstName: 'Sylke', lastName: 'Schyska', grade: 'Q11' },
      { firstName: 'Valentin', lastName: 'Schräber', grade: 'Q11' },
      { firstName: 'Oliver', lastName: 'Lembcke', grade: 'Q11' },
      { firstName: 'Siegfried', lastName: 'Golz', grade: 'Q11' },
      { firstName: 'Sylke', lastName: 'Schmitz', grade: 'Q11' },
      { firstName: 'Fritz', lastName: 'Hager', grade: 'Q11' },
      { firstName: 'Herta', lastName: 'Erhard', grade: 'Q11' },
      { firstName: 'Leon', lastName: 'Weinreich', grade: 'Q11' },
      { firstName: 'Ingo', lastName: 'Kaltenbach', grade: 'Q11' },
      { firstName: 'Jan-Hendrik', lastName: 'Siegfried', grade: 'Q11' },
      { firstName: 'Matthias', lastName: 'Pascha', grade: 'Q11' },
      { firstName: 'Viktor', lastName: 'Kappes', grade: 'Q11' },
      { firstName: 'Jens', lastName: 'Paschke', grade: 'Q11' },
      { firstName: 'Jutta', lastName: 'Wendeling', grade: 'Q11' },
      { firstName: 'Richard', lastName: 'Heinz', grade: 'Q11' },
      { firstName: 'Thomas', lastName: 'Grimmer', grade: 'Q11' }
    ]

    for (let person of peopleList) {
      this.addPerson(person.firstName, person.lastName, person.grade)
    }
    this.syncData()
  },
  getCurrentPersonsCount () {
    let grade = this.getCurrentGrade()
    return this.data.grades[grade].personsCount
  },
  getCurrentPlacedPersonsCount () {
    let grade = this.getCurrentGrade()
    return this.data.grades[grade].placed
  },
  /**
   * Indicate if all persons in a grade are having a seat and are places.
   *
   * @returns boolean
   */
  gradeIsPlaced () {
    if (this.getCurrentPersonsCount() === this.getCurrentPlacedPersonsCount()) {
      return true
    }
    return false
  },
  addJob (newJob) {
    let jobs = this.data.jobs
    if (!jobs.includes(newJob)) {
      jobs.push(newJob)
      jobs.sort(naturalSort)
      return newJob
    }
    return false
  },
  deleteJob (job) {
    let jobs = this.data.jobs
    for (let i = 0; i < jobs.length; i++) {
      if (jobs[i] === job) {
        jobs.splice(i, 1)
        i--
      }
    }
  }
}

export default dataStore
