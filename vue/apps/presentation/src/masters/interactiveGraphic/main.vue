<template>
  <div class="vc_interactive_graphic_master">
    <div ref="svgWrapper" id="svg-wrapper" v-html="svgMarkup" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import {
  mapStepFieldDefintionsToProps,
  interactiveGraphicMModule
} from '@bldr/presentation-parser'
import { buildSvgStepController } from '@bldr/dom-manipulator'
import { PresentationTypes } from '@bldr/type-definitions'

import MasterMainWithStepController from '../MasterMainWithStepController.vue'
import { warnSvgWidthHeight } from '../../lib/utils'

@Component({ props: mapStepFieldDefintionsToProps(['subset', 'mode']) })
export default class InteractiveGraphicMasterMain extends MasterMainWithStepController {
  masterName = 'interactiveGraphic'
  @Prop({
    type: String
  })
  mode!: interactiveGraphicMModule.InkscapeMode

  @Prop({
    type: String
  })
  src!: string

  @Prop({
    type: String,
    required: true
  })
  svgPath!: string

  @Prop({
    type: String,
    required: true
  })
  svgTitle!: string

  get svgMarkup (): string {
    return this.$store.getters[
      'presentation/masters/interactiveGraphic/svgByUri'
    ](this.src)
  }

  afterSlideNoChange (): void {
    warnSvgWidthHeight(this.svgPath)
    if (this.mode !== 'none') {
      this.stepController = buildSvgStepController(
        this.$el as HTMLElement,
        this.slide.props
      )
    }
  }

  afterStepNoChange ({
    newStepNo
  }: PresentationTypes.OldNewStepSlideNos): void {
    if (this.mode === 'none') {
      return
    }
    this.stepController.showUpTo(newStepNo)
  }
}
</script>

<style lang="scss">
.vc_interactive_graphic_master {
  padding: 3em 3em;
  background-color: white;

  svg {
    bottom: 0;
    height: 90%;
    left: 0;
    object-fit: contain;
    width: 92%;
  }
}
</style>
