<template>
  <div class="vc_tree_title">
    <title-link :folder="title.folder" />
    <tree-title-list :list="title.sub" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { TitlesTypes } from '@bldr/type-definitions'

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
