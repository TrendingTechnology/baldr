<template>
  <div class="import-persons">
    <pre>Familienname\tVorname\tGeschlecht\tKlasse\tGeburtsdatum
Insgesamt:
Mustermann\tMax\tmännlich\t05a\t17.11.2006</pre>

    <textarea rows="10" cols="80" v-model="importString"></textarea>
    <p><button @click="eventListenerClick">importieren</button></p>
  </div>
</template>

<script>
export default {
  name: 'ImportPersons',
  data () {
    return {
      importString: ''
    }
  },
  methods: {
    eventListenerClick (event) {
      this.$store.dispatch('importFromSpreadsheet', this.importString)
    }
  }
}
</script>
