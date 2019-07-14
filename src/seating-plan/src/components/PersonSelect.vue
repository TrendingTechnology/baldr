<template>
  <dynamic-select
    :options="persons"
    option-value="id"
    option-text="name"
    v-model="selectedPerson"
    @input="eventListenerSearch"
  />
</template>

<script>
// Components
import DynamicSelect from './DynamicSelect.vue'

export default {
  name: 'PersonSelect',
  data () {
    return {
      selectedPerson: ''
    }
  },
  components: {
    DynamicSelect
  },
  computed: {
    persons () {
      let personsOrig = this.$store.getters.personsByGradeAsListSortedCurrent
      if (personsOrig) {
        let persons = []
        for (let person of personsOrig) {
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
    eventListenerSearch () {
      this.$store.dispatch('placePerson', { seatNo: this.$store.getters.currentSeat, personId: this.selectedPerson.id })
      this.$store.dispatch('closeModal')
    }
  }
}
</script>
