<template>
  <div
    class="
      vc_editor_master_preview
      slide-preview-valign-top
      slide-preview-fix-typography
      slide-preview-fullscreen
    "
    b-content-theme="handwriting"
    b-content-theme-unchangeable
    spellcheck="false"
    v-html="markup"
  ></div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class EditorMasterPreview extends MasterPreview {
  masterName = 'editor'

  @Prop({
    type: String
  })
  markup!: string
}
</script>

<style lang="scss">
.vc_editor_master_preview {
  ul li {
    text-indent: 0 !important;

    &::before {
      margin-left: 0 !important;
    }
  }
}
</style>
