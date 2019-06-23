<template>
  <div class="import-persons">
    <heading-title title="SchülerInnen importieren"/>

    <textarea rows="10" cols="80" v-model="importString"></textarea>
    <p><button @click="eventListenerClick">importieren</button></p>
    {{ importString }}
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import HeadingTitle from './HeadingTitle'

export default {
  name: 'ImportPersons',
  components: {
    HeadingTitle
  },
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
