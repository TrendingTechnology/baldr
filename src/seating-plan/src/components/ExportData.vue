<template>
  <div class="export-data">
    <heading-title title="Daten exportieren"/>
    <a
      :href="stateAsURIComponent"
      :download="`seating-plan_${dateTime}.json`"
    >
      Die Sitzplan-Daten als JSON exportieren
    </a>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'ExportData',
  components: {
    HeadingTitle
  },
  computed: {
    ...mapGetters(['stateAsURIComponent']),
    dateTime () {
      let date = new Date()
      let isoString = date.toISOString()
      isoString = isoString.replace(/\.\d+Z/, '')
      return isoString.replace(new RegExp(':', 'g'), '-')
    }
  }
}
</script>
