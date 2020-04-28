<template>
  <dynamic-select
    :options="persons"
    @input="placePerson"
    v-model="selectedPerson"
    placeholder="Suche eine/n SchülerIn"
  />
</template>

<script>
export default {
  name: 'PersonSelect',
  data () {
    return {
      selectedPerson: ''
    }
  },
  computed: {
    persons () {
      const personsOrig = this.$store.getters.personsByGradeAsListSortedCurrent
      if (personsOrig) {
        const persons = []
        for (const person of personsOrig) {
          if (!person.seatNo) {
            persons.push({ id: person.id, name: `${person.lastName}, ${person.firstName}` })
          }
        }
        return persons
      }
      return []
    }
  },
  methods: {
    placePerson () {
      this.$store.dispatch('placePerson', {
        seatNo: this.$store.getters.seatNoCurrent,
        personId: this.selectedPerson.id
      })
      this.$modal.hide('person-select')
    }
  }
}
</script>
