<template>
  <div
    class="
      vc_presentation_overview
      main-app-padding
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <h1>Überblick über alle Präsentationen</h1>
    <ul>
      <presentation-item :item="folderTitleTree"/>
    </ul>
  </div>
</template>

<script>
import PresentationItem from './PresentationItem.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'PresentationOverview',
  components: {
    PresentationItem
  },
  methods: {
    async loadTitleTree () {
      await this.$store.dispatch('presentation/updateFolderTitleTree')
      if (this.presentation) {
        const elmentLink = document.getElementById(`PID_${this.presentation.id}`)
        elmentLink.scrollIntoView({ block: 'center' })
      }
    }
  },
  computed: mapGetters(['folderTitleTree', 'presentation']),
  mounted () {
    this.loadTitleTree()
  },
  update () {
    this.loadTitleTree()
  }
}
</script>
