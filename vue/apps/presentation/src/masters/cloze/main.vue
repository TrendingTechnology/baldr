<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { mapStepFieldDefintionsToProps } from '@bldr/presentation-parser'
import { buildClozeStepController } from '@bldr/dom-manipulator'
import { PresentationTypes } from '@bldr/type-definitions'

import { warnSvgWidthHeight } from '../../lib/utils'
import MasterMainWithStepController from '../MasterMainWithStepController.vue'

/**
 * @param componentElement - The parent component element.
 *   `<div class="vc_cloze_master master-inner">`
 */
function scrollToClozeGroup (
  componentElement: Element,
  scrollContainer: Element,
  clozeGroup: SVGGElement
): void {
  if (!clozeGroup) {
    return
  }

  // e. g.: 1892
  // svg.clientHeight
  const svg = componentElement.querySelector('svg')
  if (svg == null) {
    return
  }
  // e. g.: 794.4473876953125
  // bBox.height
  const bBox = svg.getBBox()
  const glyph = clozeGroup.children[0] as SVGForeignObjectElement
  // e. g.: 125.11000061035156
  const glyphOffsetTopSvg =
    (svg.clientHeight / bBox.height) * glyph.y.baseVal.value
  const scrollToTop = glyphOffsetTopSvg - 0.8 * scrollContainer.clientHeight
  scrollContainer.scrollTo({ top: scrollToTop, left: 0, behavior: 'smooth' })
}

@Component({
  props: mapStepFieldDefintionsToProps(['subset'])
})
export default class ClozeMasterMain extends MasterMainWithStepController {
  masterName = 'cloze'

  @Prop({
    type: String,
    required: true
  })
  src!: string

  get svgMarkup (): string {
    return this.$store.getters['presentation/masters/cloze/svgByUri'](this.src)
  }

  afterSlideNoChange ({ newSlideNo }: PresentationTypes.OldNewSlideNos): void {
    const slide = this.$store.getters['presentation/slideByNo'](newSlideNo)
    warnSvgWidthHeight()
    this.stepController = buildClozeStepController(
      this.$el as HTMLElement,
      slide.props.stepSubset
    )
    this.stepController.hideFromSubsetBegin()
  }

  afterStepNoChange ({ newStepNo }: PresentationTypes.OldNewStepSlideNos): void {
    if (newStepNo === 1) {
      this.stepController.hideFromSubsetBegin()
    }
    const step = this.stepController.showUpTo(newStepNo)
    if (step != null) {
      const newClozeGroup = step.htmlElement as SVGGElement

      // <div class="vc_slide_main">
      //   <div class="vc_master_renderer">
      //     <div class="vc_cloze_master master-inner">
      const scrollContainer = this.$el.parentElement?.parentElement
      if (scrollContainer != null) {
        scrollToClozeGroup(this.$el, scrollContainer, newClozeGroup)
      }
    }
  }
}
</script>

<style lang="scss">
.vc_cloze_master {
  padding: 0;
  background-color: white;

  svg {
    width: 100%;
    height: auto;
  }
}
</style>
