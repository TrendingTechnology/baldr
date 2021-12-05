<template>
  <div class="vc_tree_title">
    <title-link :folder="title.folder" />
    <tree-title-list :list="title.sub" />
  </div>
</template>

<script lang="ts">
import { TitlesTypes } from '@bldr/type-definitions'

import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

@Component
export default class TreeTitle extends Vue {
  @Prop()
  readonly title!: TitlesTypes.TreeTitle

  get level (): number {
    if (this.title.folder.level != null) {
      return this.title.folder.level
    }
    return 0
  }
}
</script>
