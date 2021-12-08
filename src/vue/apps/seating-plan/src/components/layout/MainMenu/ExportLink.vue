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

<script lang="ts">
import { Component, Vue, mapGetters } from '@bldr/vue-packages-bundler'

@Component({
  computed: {
    ...mapGetters(['stateAsUriComponent'])
  }
})
export default class ExportLink extends Vue {
  get dateTime () {
    const date = new Date()
    let isoString = date.toISOString()
    isoString = isoString.replace(/\.\d+Z/, '')
    return isoString.replace(new RegExp(':', 'g'), '-')
  }
}
</script>
