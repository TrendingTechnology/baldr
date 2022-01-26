<template>
  <div class="vc_cursor_arrows">
    <svg :class="cssClassesUp()" @click="up" viewBox="0 0 100 100">
      <title>{{ htmlTitlesUp }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z" />
    </svg>

    <svg :class="cssClassesRight()" @click="right" viewBox="0 0 100 100">
      <title>{{ htmlTitlesRight }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z" />
    </svg>

    <svg :class="cssClassesDown()" @click="down" viewBox="0 0 100 100">
      <title>{{ htmlTitlesDown }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z" />
    </svg>

    <svg :class="cssClassesLeft()" @click="left" viewBox="0 0 100 100">
      <title>{{ htmlTitlesLeft }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z" />
    </svg>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

import * as actions from '../../lib/actions'
import { Slide, Presentation } from '../../content-file.js'

const { mapGetters, mapActions } = createNamespacedHelpers('presentation')

interface CssClasses {
  up?: boolean
  down?: boolean
  right?: boolean
  left?: boolean
  activated: boolean
  triggered: boolean
}

interface CursorArrowState {
  triggered: boolean
  timeoutId: number | null
}

interface CursorArrowStates {
  up: CursorArrowState
  down: CursorArrowState
  right: CursorArrowState
  left: CursorArrowState
}

@Component({
  computed: mapGetters([
    'presentation',
    'cursorArrowsStates',
    'slide',
    'slideNo',
    'slidesCount'
  ]),
  methods: mapActions(['highlightCursorArrow'])
})
export default class CursorArrows extends Vue {
  presentation!: Presentation
  cursorArrowsStates!: CursorArrowStates
  slide!: Slide
  slideNo: number
  slidesCount: number
  /**
   * HTML titles
   */
  get htmlTitlesUp (): string {
    if (!this.slide || !this.slide.stepCount || this.slide.stepCount < 2) {
      return ''
    }
    const no =
      this.slide.stepNo !== 1 ? this.slide.stepNo - 1 : this.slide.stepCount
    return `zum vorhergehenden Schritt (Nr. ${no} von ${this.slide.stepCount})`
  }

  get htmlTitlesRight (): string {
    const no = this.slideNo !== this.slidesCount ? this.slideNo + 1 : 1
    return `zur nächsten Folien (Nr. ${no} von ${this.slidesCount})`
  }

  get htmlTitlesDown (): string {
    if (!this.slide || !this.slide.stepCount || this.slide.stepCount < 2) {
      return ''
    }
    const no =
      this.slide.stepNo !== this.slide.stepCount ? this.slide.stepNo + 1 : 1
    return `zum nächsten Schritt (Nr. ${no} von ${this.slide.stepCount})`
  }

  get htmlTitlesLeft (): string {
    const no = this.slideNo !== 1 ? this.slideNo - 1 : this.slidesCount
    return `zur vorhergehenden Folien (Nr. ${no} von ${this.slidesCount})`
  }

  up (): void {
    actions.goToPreviousStep()
  }

  right (): void {
    actions.goToNextSlide()
  }

  down (): void {
    actions.goToNextStep()
  }

  left (): void {
    actions.goToPreviousSlide()
  }

  /**
   * CSS classes
   */
  cssClassesUp (): CssClasses {
    return {
      up: true,
      activated: this.isUpActive(),
      triggered: this.cursorArrowsStates.up.triggered
    }
  }

  cssClassesRight (): CssClasses {
    return {
      right: true,
      activated: this.isRightActive(),
      triggered: this.cursorArrowsStates.right.triggered
    }
  }

  cssClassesDown (): CssClasses {
    return {
      down: true,
      activated: this.isDownActive(),
      triggered: this.cursorArrowsStates.down.triggered
    }
  }

  cssClassesLeft (): CssClasses {
    return {
      left: true,
      activated: this.isLeftActive(),
      triggered: this.cursorArrowsStates.left.triggered
    }
  }

  isUpActive (): boolean {
    if (this.slide && this.slide.stepCount > 1 && this.slide.stepNo !== 1) {
      return true
    }
    return false
  }

  isRightActive (): boolean {
    if (this.slideNo !== this.slidesCount) {
      return true
    }
    return false
  }

  isDownActive (): boolean {
    if (
      this.slide &&
      this.slide.stepCount > 1 &&
      this.slide.stepNo !== this.slide.stepCount
    ) {
      return true
    }
    return false
  }

  isLeftActive (): boolean {
    if (this.slideNo !== 1) {
      return true
    }
    return false
  }
}
</script>

<style lang="scss">
.vc_cursor_arrows {
  bottom: 0.5vw;
  box-sizing: border-box;
  font-size: 1.5vw;
  height: 2.1em;
  position: fixed;
  left: 96.3vw;
  width: 2.1em;

  svg {
    box-sizing: border-box;
    fill: $gray;
    height: 0.7em;
    opacity: 0.1;
    position: absolute;
    transition-duration: 0.05s;
    transition-property: fill, opacity;
    width: 0.7em;
  }

  svg.activated:hover {
    opacity: 0.6;
  }

  svg.activated {
    fill: $blue;
    opacity: 0.4;
  }

  svg.triggered {
    fill: $orange;
    opacity: 1;
    transition-property: fill, opacity;
    transition-duration: 0.05s;
  }

  .up {
    left: 0.7em;
    top: 0.2em;
    transform: rotate(135deg);
  }

  .right {
    left: 1.2em;
    top: 0.7em;
    transform: rotate(225deg);
  }

  .down {
    left: 0.7em;
    top: 1.2em;
    transform: rotate(315deg);
  }

  .left {
    left: 0.2em;
    top: 0.7em;
    transform: rotate(405deg);
  }
}
</style>
