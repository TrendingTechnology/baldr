<template>
  <div
    class="
      vc_note_master_preview
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
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class NoteMasterPreview extends Vue {
  masterName = 'note'

  @Prop({
    type: String
  })
  markup!: string
}
</script>

<style lang="scss">
.vc_note_master_preview {
  ul li {
    text-indent: 0 !important;
    margin: 0.05em 0;

    &::before {
      margin-left: 0 !important;
    }
  }
}
</style>
