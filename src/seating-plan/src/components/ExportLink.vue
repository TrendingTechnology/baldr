<template>
  <a
    :href="stateAsURIComponent"
    :download="`seating-plan_${dateTime}.json`"
    title="Daten exportieren (als JSON)"
  >
    <material-icon name="export" />
  </a>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'
export default {
  name: 'ExportLink',
  components: { MaterialIcon },
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
