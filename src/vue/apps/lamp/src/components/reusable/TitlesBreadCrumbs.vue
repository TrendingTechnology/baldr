<template>
  <ul
    class="vc_titles_bread_crumbs"
    v-if="rootTreeList"
  >

    <li>
      <router-link
        to="/titles"
      >Alle Themen</router-link>
    </li>

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
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'

import type { TitlesTypes } from '@bldr/type-definitions'

const mapLampGetters = createNamespacedHelpers('lamp').mapGetters
const mapTitlesGetters = createNamespacedHelpers('lamp/titles').mapGetters

interface Segment {
  relPath: string
  text: string
}

@Component({
  computed: {
    ...mapLampGetters(['presentation']),
    ...mapTitlesGetters(['rootTreeList'])
  }
})
export default class TitlesBreadCrumbs extends Vue {
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
    let relPath: string
    if (this.notLast) {
      relPath = this.relPath.replace(new RegExp('/[^/]+/?$'), '')
    } else {
      relPath = this.relPath
    }
    const relPathSegments = relPath.split('/')
    const segments: Segment[] = []
    let treeList = this.rootTreeList
    for (let index = 0; index < relPathSegments.length; index++) {
      const relPathSegment = relPathSegments[index]
      if (treeList[relPathSegment] != null) {
        segments.push({
          relPath: ['titles', ...relPathSegments.slice(0, index + 1)].join('/'),
          text: treeList[relPathSegment].folder.title
        })
        treeList = treeList[relPathSegment].sub
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
ul.vc_titles_bread_crumbs {
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
