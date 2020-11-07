<template>
  <div class="vc_top_level_jumpers" v-if="topTopics">
    <span class="separator">→</span>
    <span  v-for="topic in topTopics" :key="topic.path">
      <router-link :to="topic.path" v-html="topic.title"/>
      <span class="separator">~</span>
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'TopLevelJumpers',
  props: {
    path: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['folderTitleTree']),
    topTopics () {
      let tree = this.folderTitleTree
      if (this.path && this.path !== 'Musik') {
        const segments = this.path.split('/')
        for (const folderName of segments) {
          if (tree && tree.subTree) tree = tree.subTree[folderName]
        }
      }
      const topics = []
      if (!tree) return
      for (const folderName of Object.keys(tree).sort()) {
        const topic = tree[folderName].title
        if (topic) {
          topics.push({
            title: topic.title,
            path: `/topics/${topic.path}`
          })
        }
      }
      if (!topics.length) return
      return topics
    }
  }
}
</script>

<style lang="scss">
  .vc_top_level_jumpers {
    font-size: 0.7em;

    .separator {
      display: inline-block;
      padding: 0 0.5em;
    }
  }
</style>
