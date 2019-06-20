const dataStore = {
  data: {
    persons: {},
    grades: [],
    seatingPlanLayout: [],
    seatingPlans: {}
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
  }
}

export default dataStore;
