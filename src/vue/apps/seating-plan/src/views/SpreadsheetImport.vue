<template>
  <main class="vc_spreadsheet_import">
    <pre>Familienname\tVorname\tKlasse
Insgesamt:
Mustermann\tMax\t\t05a</pre>

    <textarea rows="10" cols="80" v-model="importString"></textarea>
    <p><button @click="importFromSpreadsheet">importieren</button></p>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'

@Component
export default class SpreadsheetImport extends Vue {
  importString = ''

  importFromSpreadsheet (): void {
    console.log(this.importString)
    this.$store.dispatch('importFromSpreadsheet', this.importString)
  }
}
</script>
