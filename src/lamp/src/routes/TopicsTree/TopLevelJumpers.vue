<template>
  <div class="vc_top_level_jumpers">
    <span class="separator">~</span>
    <span  v-for="topic in topTopics" :key="topic.path">
      <router-link :to="topic.path">
        {{ topic.title }}
      </router-link>
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
          tree = tree[folderName]
        }
      }
      const topics = []
      for (const folderName of Object.keys(tree).sort()) {
        const topic = tree[folderName]._title
        if (topic) {
          topics.push({
            title: topic.title,
            path: `/topics/${topic.path}`
          })
        }
      }
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
