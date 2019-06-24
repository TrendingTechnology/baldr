<template>
  <div class="dynamic-select-overlay">
    <dynamic-select
      :options="persons"
      option-value="id"
      option-text="name"
      v-model="selectedPerson"
      @input="eventListenerSearch"
    />
  </div>
</template>

<script>
import DynamicSelect from './DynamicSelect.vue'

import dataStore from '../data-store.js'

export default {
  name: 'DynamicSelectOverlay',
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
        persons.push({ id: person.id, name: `${person.lastName}, ${person.firstName}` })
      }
      return persons
    }
  },
  methods: {
    eventListenerSearch () {
      console.log(this.selectedPerson)
    }
  }
}
</script>

<style scoped>
.dynamic-select-overlay {
  display: fixed;
  z-index: 9;
  background-color: green;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
</style>
