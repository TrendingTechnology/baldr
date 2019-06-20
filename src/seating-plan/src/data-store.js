
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
      [[25, 26, 27, 28], [29, 30, 31, 32]],
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

const seatingPlanLayout = new SeatingPlanLayout()

const dataStore = {
  data: {
    currentGrade: '',
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
    plans: {}
  },
  getData () {
    return this.data
  },
  addPerson (firstName, lastName, grade) {
    // grade
    if (!this.data.persons.hasOwnProperty(grade)) {
      this.data.persons[grade] = {}
    }

    // lastName
    if (!this.data.persons[grade].hasOwnProperty(lastName)) {
      this.data.persons[grade][lastName] = {}
    }

    // firstName
    if (this.data.persons[grade][lastName].hasOwnProperty(firstName)) {
      throw new Error(`Person already exists ${firstName} ${lastName} ${grade}`)
    }

    this.data.persons[grade][lastName][firstName] = {
      id: `${grade}: ${lastName}, ${firstName}`,
      firstName: firstName,
      lastName: lastName,
      grade: grade,
      seatNo: 0,
      placed: false
    }

    // Add grade to grade list.
    if (!this.data.grades.includes(grade)) {
      this.data.grades.push(grade)
      this.data.grades.sort()
    }
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
    return this.data.grades
  },
  getCurrentGrade () {
    return this.data.currentGrade
  },
  setCurrentGrade (grade) {
    this.data.currentGrade = grade
  },
  initPlan (grade) {
    let plans = this.data.plans
    if (!plans.hasOwnProperty(grade)) {
      plans[grade] = {}
    }
    for (let no = 1; no <= this.data.seats.count; no++) {
      if (!plans[grade].hasOwnProperty(no)) {
        plans[grade][no] = ''
      }
    }
  },
  placePersonById (no, id) {
    this.data.plans[this.data.currentGrade][no] = id
    let person = this.getPersonById(id)
    person.seatNo = no
  },
  syncData () {
    for (let grade of this.data.grades) {
      this.initPlan(grade)
    }
  }
}

export default dataStore;
