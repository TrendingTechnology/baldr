<template>
  <a
    :href="stateAsUriComponent"
    :download="`seating-plan_${dateTime}.json`"
    title="Daten exportieren (als JSON)"
    class="vc_export_link"
  >
    <material-icon name="export" />
  </a>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'ExportLink',
  computed: {
    ...mapGetters([
      'stateAsUriComponent'
    ]),
    dateTime () {
      const date = new Date()
      let isoString = date.toISOString()
      isoString = isoString.replace(/\.\d+Z/, '')
      return isoString.replace(new RegExp(':', 'g'), '-')
    }
  }
}
</script>
