<template>
  <div class="import-persons">
    <h1>SchülerInnen importieren</h1>
    <textarea rows="10" cols="80" v-model="importString"></textarea>
    <p><button @click="eventListenerClick">importieren</button></p>
    {{ importString }}
  </div>
</template>

<script>
import dataStore from '../data-store.js'

export default {
  name: 'ImportPersons',
  data: function () {
    return {
      importString: '',
      data: dataStore.getData()
    }
  },
  methods: {
    eventListenerClick (event) {
      for (let line of this.importString.split('\n')) {
        let match = line.match(/(.*)\t(.*)\t(.*)\t(.*)\t([^]*)/)
        if (match && match[1] !== 'Familienname' && match[1] !== 'Insgesamt:') {
          let lastName = match[1]
          let firstName = match[2]
          let grade = match[4]
          dataStore.addPerson(firstName, lastName, grade)
          dataStore.syncData()
        }
      }
    }
  }
}
</script>

<style scoped>
</style>
