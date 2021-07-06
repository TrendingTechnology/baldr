<template>
  <div class="vc_tree_title">
    <title-link
      :folder="title.folder"
    />
    <tree-title-list :list="title.sub"/>
  </div>
</template>

<script lang="ts">
import type { TitlesTypes } from '@bldr/type-definitions'

import TitleLink from './TitleLink.vue'
import TreeTitleList from './TreeTitleList.vue'

import { Vue, Component, Prop } from 'vue-property-decorator'


@Component({
  components: {
    TitleLink,
    TreeTitleList
  }
})
export default class TreeTitle extends Vue {
  @Prop()
  readonly title!: TitlesTypes.TreeTitle
}
</script>

<style lang="scss">
  .vc_tree_title {

  }
</style>
