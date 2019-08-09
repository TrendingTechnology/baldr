<template>
  <dynamic-select
    :options="persons"
    @input="placePerson"
    v-model="selectedPerson"
  />
</template>

<script>
// Components
import { DynamicSelect } from '@bldr/vue-components'

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
