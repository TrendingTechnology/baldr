<template>
  <div class="vc_note_master bigger" v-html="markup" />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { buildTextStepController } from '@bldr/dom-manipulator'
import { LampTypes } from '@bldr/type-definitions'

import MasterMainWithStepController from '../MasterMainWithStepController.vue'

@Component
export default class NoteMasterMain extends MasterMainWithStepController {
  masterName = 'note'

  @Prop({
    type: String
  })
  markup!: string

  afterSlideNoChange (): void {
    this.stepController = buildTextStepController(this.$el as HTMLElement, {
      stepMode: 'words'
    })
  }

  afterStepNoChange ({ newStepNo }: LampTypes.OldNewStepSlideNos): void {
    const step = this.stepController.showUpTo(newStepNo)
    if (step != null) {
      this.scroll(step.htmlElement as HTMLElement)
    }
  }

  private scroll (element: HTMLElement): void {
    // <div class="vc_slide_main">
    //   <div class="vc_master_renderer">
    //     <div class="vc_note_master master-inner">
    const scrollContainer = this.$el.parentElement?.parentElement
    if (scrollContainer == null) {
      return
    }
    const adjustedY = element.offsetTop - 0.85 * scrollContainer.clientHeight
    scrollContainer.scrollTo({ top: adjustedY, left: 0, behavior: 'smooth' })
  }
}
</script>

<style lang="scss">
.vc_note_master {
  // left right padding more because of ul ol etc ...
  padding: 1em 2.5em;

  table {
    table-layout: fixed;
  }

  &.bigger {
    line-height: 1.35em;
  }
}
</style>
