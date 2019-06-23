<template>
  <div class="export-data">
    <vue-headful title="Daten exportieren"/>
    <h1>Daten exportieren</h1>
    <a
      :href="dataString"
      download="seating-plan.json"
    >
      DOWNLOAD DATA AS JSON
    </a>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import vueHeadful from 'vue-headful'

export default {
  name: 'ExportData',
  components: {
    vueHeadful
  },
  computed: {
    dataString () {
      let string = encodeURIComponent(JSON.stringify(dataStore.getData()))
      return `data:text/json;charset=utf-8,${string}`
    }
  }
}
</script>

<style scoped>
</style>
