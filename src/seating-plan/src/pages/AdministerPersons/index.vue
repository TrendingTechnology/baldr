<template>
  <main>
    <section>
      <persons-table :start=1 :count=12 />

      <persons-table :start=13 :count=12 />

      <persons-table :start=25 :count=12 />

      <form-add-person/>

    </section>

  </main>
</template>

<script>
import FormAddPerson from './form'
import PersonsTable from './PersonsTable'

export default {
  name: 'AdministerPersons',
  components: {
    FormAddPerson,
    PersonsTable
  },
  beforeCreate: function () {
    let grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  },
  created: function () {
    let gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  },
  methods: {
    rename (person, property, event) {
      const newValue = event.target.innerText
      const payload = {
        person: person
      }
      if (property === 'firstName') {
        payload.newFirstName = newValue
      } else if (property === 'lastName') {
        payload.newLastName = newValue
      }
      this.$store.commit('renamePerson', payload)
    }
  }
}
</script>

<style scoped>
  section {
    column-count: 3;
  }
</style>
