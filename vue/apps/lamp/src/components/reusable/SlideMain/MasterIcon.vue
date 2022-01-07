<template>
  <span :class="cssClasses" v-if="showOnSlides" b-content-theme="default">
    <color-icon :name="iconName" :color="iconColor" />
  </span>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide, Master } from '@bldr/presentation-parser'

type Icon = Master['icon']

@Component
export default class MasterIcon extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: Slide

  private get icon (): Icon {
    return this.slide.master.icon
  }

  public get iconName (): string {
    return this.icon.name
  }

  public get iconSize (): 'large' | 'small' {
    return this.icon.size
  }

  public get iconColor (): string {
    return this.icon.color
  }

  public get showOnSlides (): boolean {
    return this.icon.showOnSlides
  }

  public get cssClasses (): string[] {
    return ['vc_master_icon', this.iconSize]
  }
}
</script>

<style lang="scss">
// See styling:
// - components/reusable/SlideMain/MasterIcon.vue (Basic styling)
// - routes/SpeakerView/index.vue (Adjustments for the speaker view)
// - routes/SlideView/index.vue (Adjustments for the main slide view)
.vc_master_icon {
  background: none !important;
  position: absolute;
  z-index: 2;
}
</style>
