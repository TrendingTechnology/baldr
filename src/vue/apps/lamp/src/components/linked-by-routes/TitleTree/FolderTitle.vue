<template>
  <div class="vc_presentation_treeTitle">
    <title-link
      :tree-title="treeTitle"
    />
    <ul
      :class="`ul-level-${treeTitle.folder.level}`"
      v-if="hasChilds"
    >
      <li
        v-for="treeTitle in childs"
        :key="treeTitle.folder.path"
      >
        <folder-title :treeTitle="treeTitle"/>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import TitleLink from './TitleLink.vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import { TitlesTypes } from '@bldr/type-definitions'

@Component({
  components: {
    TitleLink
  }
})
export default class FolderTitle extends Vue {
  @Prop()
  readonly treeTitle?: TitlesTypes.TreeTitle

  get hasChilds () {
    return (
      this.treeTitle != null &&
      this.treeTitle.sub != null &&
      Object.keys(this.treeTitle.sub).length >= 1
    )
  }

  get childs () {
    if (this.treeTitle == null || this.treeTitle.sub == null) {
      return []
    }
    const treeTitles: TitlesTypes.TreeTitle[] = []
    const keys = Object.keys(this.treeTitle.sub).sort()
    for (const key of keys) {
      treeTitles.push(this.treeTitle.sub[key])
    }
    return treeTitles
  }
}
</script>

<style lang="scss">
  .vc_presentation_treeTitle {
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
