<template>
  <div class="vc_top_level_jumpers" v-if="topTitles">
    <span class="separator">→</span>
    <span v-for="title in topTitles" :key="title.relPath">
      <router-link :to="title.relPath" v-html="title.title" />
      <span class="separator">~</span>
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'

import { TitlesTypes } from '@bldr/type-definitions'

const { mapGetters } = createNamespacedHelpers('lamp/titles')

interface TopTitle {
  title: string
  relPath: string
}

@Component({
  computed: mapGetters(['subTreeList'])
})
export default class TopLevelJumpers extends Vue {
  @Prop({
    type: String
  })
  relPath!: string

  subTreeList!: TitlesTypes.TreeTitleList

  get topTitles (): TopTitle[] | undefined {
    const topTitles = []
    for (const folderName of Object.keys(this.subTreeList).sort()) {
      const topTitle = this.subTreeList[folderName].folder
      if (topTitle) {
        topTitles.push({
          title: topTitle.title,
          relPath: `/titles/${topTitle.relPath}`
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
