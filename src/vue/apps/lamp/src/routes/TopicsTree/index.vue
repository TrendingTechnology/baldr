<template>
  <div
    class="
      vc_topics_tree
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <loading-icon v-if="!folderTitleTree"/>
    <div v-else>
      <topic-bread-crumbs v-if="path" :path="path"/>
      <top-level-jumpers :path="path"/>
      <section class="topics">
        <h1>Themen</h1>
        <presentation-item v-if="subFolderTitleTree" :tree-title="subFolderTitleTree"/>
        <presentation-item v-else :tree-title="folderTitleTree"/>
      </section>
    </div>
  </div>
</template>

<script>
import LoadingIcon from '@/components/LoadingIcon.vue'
import PresentationItem from './PresentationItem.vue'
import TopicBreadCrumbs from '@/components/TopicBreadCrumbs.vue'
import TopLevelJumpers from './TopLevelJumpers.vue'

export function toRef (folderName) {
  return folderName.substr(3)
}

async function enterRoute (vm, to) {
  await vm.$store.dispatch('lamp/loadFolderTitleTree')
  vm.setSubFolderTitleTreeByIds(to.params.ids)
  const presentation = vm.$store.getters['lamp/presentation']
  if (presentation) {
    const elementLink = document.getElementById(`PREF_${presentation.ref}`)
    if (elementLink) elementLink.scrollIntoView({ block: 'center' })
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
    setSubFolderTitleTreeByIds (refs) {
      if (!refs) return
      if (refs === 'Musik') {
        this.subFolderTitleTree = null
        return this.folderTitleTree
      }
      refs = refs.split('/')
      let tree = this.folderTitleTree
      for (const ref of refs) {
        if (tree && tree.subTree) tree = tree.subTree[ref]
      }
      this.subFolderTitleTree = tree
    }
  },
  mounted () {
    this.path = this.$route.params.ids
  },
  computed: {
    folderTitleTree () {
      const subTree = this.$store.getters['lamp/folderTitleTree']
      return {
        subTree,
        title: {
          title: 'Fach Musik',
          level: 0,
          hasPresentation: false,
          path: '/',
          folderName: 'musik'
        }
      }
    }
  },
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

<style lang="scss">
  .vc_topics_tree {
    .topics {
      padding: 0 5em;
    }

    .vc_top_level_jumpers {
      padding-left: 2em;
    }

    .vc_topic_bread_crumbs {
      margin: 0.3em;
      font-size: 0.8em;
    }
  }
</style>
