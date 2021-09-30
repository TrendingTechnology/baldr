<template>
  <div class="vc_tree_title">
    <title-link :folder="title.folder" />
    <tree-title-list :list="title.sub" :level="level" />
  </div>
</template>

<script lang="ts">
import { TitlesTypes } from '@bldr/type-definitions'

import { Vue, Component, Prop } from 'vue-property-decorator'

@Component
export default class TreeTitle extends Vue {
  @Prop()
  readonly title!: TitlesTypes.TreeTitle

  get level (): number {
    if (this.title.folder.level != null) {
      return this.title.folder.level + 1
    }
    return 0
  }
}
</script>
