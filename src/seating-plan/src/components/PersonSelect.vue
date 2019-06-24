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
import DynamicSelect from './DynamicSelect.vue'
import dataStore from '../data-store.js'

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
      let personsOrig = dataStore.getPersons(dataStore.getCurrentGrade())
      let persons = []
      for (let person of personsOrig) {
        if (!person.seatNo) {
          persons.push({ id: person.id, name: `${person.lastName}, ${person.firstName}` })
        }
      }
      return persons
    }
  },
  methods: {
    eventListenerSearch () {
      console.log(this.selectedPerson)
      dataStore.placePersonById(dataStore.data.currentSeat, this.selectedPerson.id)
      dataStore.data.showModalPersonSelect = false
    }
  }
}
</script>
