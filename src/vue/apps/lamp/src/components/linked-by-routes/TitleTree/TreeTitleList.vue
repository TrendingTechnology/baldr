<template>
  <div class="vc_title_tree_list">
    <ul
      :class="`ul-level-${level}`"
      v-if="hasChilds"
    >
      <li
        v-for="treeTitle in listSorted"
        :key="treeTitle.folder.relPath"
      >
        <tree-title :title="treeTitle"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import TreeTitle from './TreeTitle.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import type { TitlesTypes } from '@bldr/type-definitions'

@Component({
  components: {
    TreeTitle
  }
})
export default class TreeTitleList extends Vue {
  @Prop()
  readonly list!: TitlesTypes.TreeTitleList

  @Prop()
  readonly level!: number

  get hasChilds (): boolean {
    return (
      this.list != null &&
      Object.keys(this.list).length > 0
    )
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

  ul {
    padding-left: 2em !important;
  }

  ul.ul-level-1 {
    margin-bottom: 2em;
  }

  .ul-level-1 > li {
    margin-top: 1em;
  }
}
</style>
