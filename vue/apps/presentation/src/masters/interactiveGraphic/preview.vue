<template>
  <div
    class="
    vc_interactive_graphic_master_preview
    slide-preview-fullscreen
    slide-preview-valign-center
  "
  >
    <img :src="svgHttpUrl" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class InteractiveGraphicMasterPreview extends Vue {
  masterName = 'interactiveGraphic'

  @Prop({
    type: String,
    required: true
  })
  svgHttpUrl!: string
}
</script>

<style lang="scss">
.vc_interactive_graphic_master_preview {
  padding: 1em;
}
</style>
