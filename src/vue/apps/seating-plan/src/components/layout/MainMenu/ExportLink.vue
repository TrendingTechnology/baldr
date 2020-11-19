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
import { mapGetters } from 'vuex'
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component({
  computed: {
    ...mapGetters([
      'stateAsUriComponent'
    ])
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
