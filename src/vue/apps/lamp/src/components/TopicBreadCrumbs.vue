<template>
  <ul
    class="vc_topic_bread_crumbs"
    v-if="folderTitleTree"
  >
    <li>
      <span class="separator">/</span>
    </li>

    <li
      v-for="(segment, index) in segments"
      :key="segment.relPath"
    >
      <router-link
        :to="`/${segment.relPath}`"
        v-html="segment.text"
      />
      <span
        v-if="index < segments.length - 1"
        class="separator"
      >/</span>
    </li>
  </ul>
</template>

<script lang="ts">
import type { TitlesTypes } from '@bldr/type-definitions'

import { Vue, Component, Prop } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

interface Segment {
  relPath: string
  text: string
}

@Component({
  computed: mapGetters(['presentation', 'titles/rootTreeList'])
})
export default class TopicBreadCrumbs extends Vue {
  @Prop({
    type: String
  })
  relPath!: string

  @Prop({
    type: Boolean,
    default: false
  })
  notLast!: boolean

  rootTreeList!: TitlesTypes.TreeTitleList

  get segments (): Segment[] {
    // 12/20_Tradition/30_Volksmusik
    let relPath: string
    if (this.notLast) {
      relPath = this.relPath.replace(new RegExp('/[^/]+/?$'), '')
    } else {
      relPath = this.relPath
    }
    const relPathSegments = relPath.split('/')
    const segments: Segment[] = []
    segments.push({ relPath: 'titles/Musik', text: 'Fach Musik' })
    let titles = this.rootTreeList
    for (let index = 0; index < relPathSegments.length; index++) {
      // 12
      // 20_Tradition
      const relPathSegment = relPathSegments[index]
      if (titles[relPathSegment]) {
        segments.push({
          relPath: ['titles', ...relPathSegments.slice(0, index + 1)].join('/'),
          text: titles[relPathSegment].folder.title
        })
        titles = titles[relPathSegment].sub
      }
    }
    return segments
  }

  mounted () {
    if (this.rootTreeList == null) {
      this.$store.dispatch('lamp/titles/loadRootTreeList')
    }
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
