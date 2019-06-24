<template>
  <modal-dialog>
    <dynamic-select
      :options="persons"
      option-value="id"
      option-text="name"
      v-model="selectedPerson"
      @input="eventListenerSearch"
    />
  </modal-dialog>
</template>

<script>
import DynamicSelect from './DynamicSelect.vue'
import ModalDialog from './ModalDialog.vue'

import dataStore from '../data-store.js'

export default {
  name: 'DynamicSelectOverlay',
  data () {
    return {
      selectedPerson: ''
    }
  },
  components: {
    DynamicSelect,
    ModalDialog
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
