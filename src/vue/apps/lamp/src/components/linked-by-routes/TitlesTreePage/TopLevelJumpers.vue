<template>
  <div class="vc_top_level_jumpers" v-if="topTitles">
    <span class="separator">→</span>
    <span  v-for="topic in topTitles" :key="topic.path">
      <router-link :to="topic.path" v-html="topic.title"/>
      <span class="separator">~</span>
    </span>
  </div>
</template>

<script lang="ts">
import type { TitlesTypes } from '@bldr/type-definitions'
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

interface TopTitle {
  title: string
  path: string
}

@Component({
  computed: mapGetters(['folderTitleTree'])
})
export default class TopLevelJumpers extends Vue {
  @Prop({
    type: String
  })

  path!: string

  folderTitleTree!: TitlesTypes.TreeTitleList

  topTitles (): TopTitle[] | undefined {
    let treeTitleList = this.folderTitleTree
    let treeTitle: TitlesTypes.TreeTitle | undefined
    if (this.path && this.path !== 'Musik') {
      const segments = this.path.split('/')
      for (const folderName of segments) {
        if (treeTitleList && treeTitleList[folderName]) {
          treeTitle = treeTitleList[folderName]
        }
      }
    }
    if (treeTitle == null || Object.keys(treeTitle.sub).length === 0) {
      return
    }
    const topTitles = []
    for (const folderName of Object.keys(treeTitle.sub).sort()) {
      const topTitle = treeTitle.sub[folderName].folder
      if (topTitle) {
        topTitles.push({
          title: topTitle.title,
          path: `/titles/${topTitle.relPath}`
        })
      }
    }
    if (topTitles.length === 0) {
      return
    }
    return topTitles
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
