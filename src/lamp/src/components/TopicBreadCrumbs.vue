<template>
  <ul class="vc_topic_bread_crumbs" v-if="folderTitleTree">
    <li><span class="separator">/</span></li>

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
    },
    notLast: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapGetters(['presentation', 'folderTitleTree']),
    segments () {
      // 12/20_Tradition/30_Volksmusik
      let path
      if (this.notLast) {
        path = this.path.replace(new RegExp('/[^/]+/?$'), '')
      } else {
        path = this.path
      }
      const segments = path.split('/')
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
            text: titles[segment].title.title
          })
          titles = titles[segment].subTree
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
