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

    <loading-icon v-if="!folderTitleTree"/>
    <presentation-item v-else-if="subFolderTitleTree" :item="subFolderTitleTree"/>
    <presentation-item v-else :item="folderTitleTree"/>
  </div>
</template>

<script>
import PresentationItem from './PresentationItem.vue'
import LoadingIcon from '@/components/LoadingIcon.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

async function enterRoute (vm, to) {
  await vm.$store.dispatch('lamp/loadFolderTitleTree')
  vm.setSubFolderTitleTreeByIds(to.params.ids)
  const presentation = vm.$store.getters['lamp/presentation']
  if (presentation) {
    const elementLink = document.getElementById(`PID_${presentation.id}`)
    elementLink.scrollIntoView({ block: 'center' })
  }
}

export default {
  name: 'PresentationOverview',
  components: {
    PresentationItem,
    LoadingIcon
  },
  data () {
    return {
      subFolderTitleTree: null
    }
  },
  methods: {
    setSubFolderTitleTreeByIds (ids) {
      if (!ids) return
      ids = ids.split('/')
      let tree = this.folderTitleTree
      for (const id of ids) {
        tree = tree[id]
      }
      this.subFolderTitleTree = tree
    }
  },
  computed: mapGetters(['folderTitleTree']),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      enterRoute(vm, to)
    })
  },
  beforeRouteUpdate (to, from, next) {
    enterRoute(this, to)
    next()
  }
}
</script>
