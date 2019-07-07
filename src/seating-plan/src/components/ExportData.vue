<template>
  <div class="export-data">
    <heading-title title="Daten exportieren"/>
    <a
      :href="dataString"
      :download="`seating-plan_${dateTime}.json`"
    >
      Die Sitzplan-Daten als JSON exportieren
    </a>
  </div>
</template>

<script>
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'ExportData',
  components: {
    HeadingTitle
  },
  computed: {
    dataString () {
      let string = encodeURIComponent(JSON.stringify(this.$store.getters.getState))
      return `data:text/json;charset=utf-8,${string}`
    },
    dateTime () {
      let date = new Date()
      let isoString = date.toISOString()
      isoString = isoString.replace(/\.\d+Z/, '')
      return isoString.replace(new RegExp(':', 'g'), '-')
    }
  }
}
</script>
