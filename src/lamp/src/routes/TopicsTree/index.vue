<template>
  <div
    class="
      vc_presentation_overview
      main-app-padding
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <loading-icon v-if="!folderTitleTree"/>
    <div v-else>
      <top-level-jumpers :path="path"/>
      <h1>Themen</h1>
      <topic-bread-crumbs v-if="path" :path="path"/>
      <presentation-item v-if="subFolderTitleTree" :item="subFolderTitleTree"/>
      <presentation-item v-else :item="folderTitleTree"/>
    </div>

  </div>
</template>

<script>
import LoadingIcon from '@/components/LoadingIcon.vue'
import PresentationItem from './PresentationItem.vue'
import TopicBreadCrumbs from '@/components/TopicBreadCrumbs.vue'
import TopLevelJumpers from './TopLevelJumpers.vue'

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
  name: 'TopicsTree',
  components: {
    LoadingIcon,
    PresentationItem,
    TopLevelJumpers,
    TopicBreadCrumbs
  },
  data () {
    return {
      subFolderTitleTree: null,
      path: null
    }
  },
  methods: {
    setSubFolderTitleTreeByIds (ids) {
      if (!ids) return
      if (ids === 'Musik') return this.folderTitleTree
      ids = ids.split('/')
      let tree = this.folderTitleTree
      for (const id of ids) {
        tree = tree[id]
      }
      this.subFolderTitleTree = tree
    }
  },
  mounted () {
    this.path = this.$route.params.ids
  },
  computed: mapGetters(['folderTitleTree']),
  beforeRouteEnter (to, from, next) {
    next(vm => {
      enterRoute(vm, to)
    })
  },
  beforeRouteUpdate (to, from, next) {
    enterRoute(this, to)
    this.path = to.params.ids
    next()
  }
}
</script>
