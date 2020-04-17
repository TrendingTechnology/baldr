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

    <presentation-item v-if="subFolderTitleTree" :item="subFolderTitleTree"/>
    <presentation-item v-else :item="folderTitleTree"/>
  </div>
</template>

<script>
import PresentationItem from './PresentationItem.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'PresentationOverview',
  components: {
    PresentationItem
  },
  data () {
    return {
      subFolderTitleTree: null
    }
  },
  methods: {
    async loadTitleTree () {
      await this.$store.dispatch('lamp/updateFolderTitleTree')
      if (this.presentation) {
        const elementLink = document.getElementById(`PID_${this.presentation.id}`)
        elementLink.scrollIntoView({ block: 'center' })
      }
    },
    setSubFolderTitleTreeByIds (ids) {
      ids = ids.split('/')
      let tree = this.folderTitleTree
      for (const id of ids) {
        tree = tree[id]
      }
      this.subFolderTitleTree = tree
    }
  },
  computed: mapGetters(['folderTitleTree', 'presentation']),
  mounted () {
    console.log(this.$route)
    this.loadTitleTree()
    this.$styleConfig.set()
  },
  update () {
    this.loadTitleTree()
  },
  beforeRouteEnter (to, from, next) {
    console.log('beforeRouteEnter', to)
    next(vm => {
    })
  },
  beforeRouteUpdate (to, from, next) {
    console.log('beforeRouteUpdate', to)
    this.setSubFolderTitleTreeByIds(to.params.ids)
    next()
  }
}
</script>
