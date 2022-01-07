<template>
  <div class="vc_title_tree_list">
    <ul v-if="hasChilds">
      <li v-for="treeTitle in listSorted" :key="treeTitle.folder.relPath">
        <tree-title :title="treeTitle" />
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { TitlesTypes } from '@bldr/type-definitions'

@Component
export default class TreeTitleList extends Vue {
  @Prop()
  readonly list!: TitlesTypes.TreeTitleList

  get level (): number {
    if (this.list == null) {
      return 1
    }
    for (const key in this.list) {
      const title = this.list[key]
      if (title.folder.level != null) {
        return title.folder.level
      }
    }
    return 1
  }

  get hasChilds (): boolean {
    return this.list != null && Object.keys(this.list).length > 0
  }

  get listSorted (): TitlesTypes.TreeTitle[] {
    if (this.list == null) {
      return []
    }
    const treeTitles: TitlesTypes.TreeTitle[] = []
    const keys = Object.keys(this.list).sort()
    for (const key of keys) {
      treeTitles.push(this.list[key])
    }
    return treeTitles
  }
}
</script>

<style lang="scss">
.vc_title_tree_list {
  ul li:before {
    content: '' !important;
  }

  // ul {
  //   padding-left: 2em !important;
  // }

  // > ul {
  //   margin-bottom: 2em;
  // }

  // .ul-level-1 > li {
  //   margin-top: 1em;
  // }
}
</style>
