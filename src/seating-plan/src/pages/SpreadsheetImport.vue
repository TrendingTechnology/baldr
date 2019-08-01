<template>
  <main class="import-persons">
    <pre>Familienname\tVorname\tGeschlecht\tKlasse\tGeburtsdatum
Insgesamt:
Mustermann\tMax\tmännlich\t05a\t17.11.2006</pre>

    <textarea rows="10" cols="80" v-model="importString"></textarea>
    <p><button @click="importFromSpreadsheet">importieren</button></p>
  </main>
</template>

<script>
export default {
  name: 'SpreadsheetImport',
  data () {
    return {
      importString: ''
    }
  },
  methods: {
    importFromSpreadsheet (event) {
      this.$store.dispatch('importFromSpreadsheet', this.importString)
    }
  }
}
</script>
