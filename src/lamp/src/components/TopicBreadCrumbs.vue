<template>
  <ul class="vc_topic_bread_crumbs" v-if="folderTitleTree">
    <li v-for="(segment, index) in segments" :key="segment.path">
      <router-link :to="`/${segment.path}`" v-html="segment.text"/>
      <span v-if="index < segments.length - 1" class="separator">/</span>
    </li>
  </ul>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'TopicBreadCrumbs',
  props: {
    path: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['presentation', 'folderTitleTree']),
    segments () {
      // 12/20_Tradition/30_Volksmusik
      const segments = this.path.split('/')
      const links = []
      links.push({ path: 'topics/Musik', text: 'Fach Musik' })
      let titles = this.folderTitleTree
      for (let index = 0; index < segments.length; index++) {
        // 12
        // 20_Tradition
        const segment = segments[index]
        if (titles[segment]) {
          links.push({
            path: ['topics', ...segments.slice(0, index + 1)].join('/'),
            text: titles[segment]._title.title
          })
          titles = titles[segment]
        }
      }
      return links
    }
  },
  mounted () {
    if (!this.folderTitleTree) this.$store.dispatch('lamp/loadFolderTitleTree')
  }
}
</script>

<style lang="scss">
  ul.vc_topic_bread_crumbs {
    padding-left: 0 !important;

    li {
      display: inline;
    }

    li::before {
      content: '' !important;
    }

    .separator {
      display: inline-block;
      padding: 0 0.3em;
    }
  }
</style>
