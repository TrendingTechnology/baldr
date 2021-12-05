<template>
  <div class="vc_cursor_arrows">
    <svg
      :class="cssClassesUp()"
      @click="up"
      viewBox="0 0 100 100"
    >
      <title>{{ htmlTitlesUp }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="cssClassesRight()"
      @click="right"
      viewBox="0 0 100 100"
    >
      <title>{{ htmlTitlesRight }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="cssClassesDown()"
      @click="down"
      viewBox="0 0 100 100"
    >
      <title>{{ htmlTitlesDown }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="cssClassesLeft()"
      @click="left"
      viewBox="0 0 100 100"
    >
      <title>{{ htmlTitlesLeft }}</title>
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

  </div>
</template>

<script>
import { createNamespacedHelpers } from '@bldr/vue-packages-bundler'
import actions from '@/actions.js'
const { mapGetters, mapActions } = createNamespacedHelpers('lamp')

export default {
  name: 'CursorArrows',
  computed: {
    ...mapGetters([
      'presentation',
      'cursorArrowsStates',
      'slide',
      'slideNo',
      'slidesCount'
    ]),
    /**
     * HTML titles
     */
    htmlTitlesUp () {
      if (!this.slide || !this.slide.stepCount || this.slide.stepCount < 2) return ''
      const no = this.slide.stepNo !== 1 ? this.slide.stepNo - 1 : this.slide.stepCount
      return `zum vorhergehenden Schritt (Nr. ${no} von ${this.slide.stepCount})`
    },
    htmlTitlesRight () {
      const no = this.slideNo !== this.slidesCount ? this.slideNo + 1 : 1
      return `zur nächsten Folien (Nr. ${no} von ${this.slidesCount})`
    },
    htmlTitlesDown () {
      if (!this.slide || !this.slide.stepCount || this.slide.stepCount < 2) return ''
      const no = this.slide.stepNo !== this.slide.stepCount ? this.slide.stepNo + 1 : 1
      return `zum nächsten Schritt (Nr. ${no} von ${this.slide.stepCount})`
    },
    htmlTitlesLeft () {
      const no = this.slideNo !== 1 ? this.slideNo - 1 : this.slidesCount
      return `zur vorhergehenden Folien (Nr. ${no} von ${this.slidesCount})`
    }
  },
  methods: {
    ...mapActions(['highlightCursorArrow']),
    up () {
      actions.goToPreviousStep()
    },
    right () {
      actions.goToNextSlide()
    },
    down () {
      actions.goToNextStep()
    },
    left () {
      actions.goToPreviousSlide()
    },
    /**
     * CSS classes
     */
    cssClassesUp () {
      return {
        up: true,
        activated: this.isUpActive(),
        triggered: this.cursorArrowsStates.up.triggered
      }
    },
    cssClassesRight () {
      return {
        right: true,
        activated: this.isRightActive(),
        triggered: this.cursorArrowsStates.right.triggered
      }
    },
    cssClassesDown () {
      return {
        down: true,
        activated: this.isDownActive(),
        triggered: this.cursorArrowsStates.down.triggered
      }
    },
    cssClassesLeft () {
      return {
        left: true,
        activated: this.isLeftActive(),
        triggered: this.cursorArrowsStates.left.triggered
      }
    },
    isUpActive () {
      if (this.slide && this.slide.stepCount > 1 && this.slide.stepNo !== 1) {
        return true
      }
      return false
    },
    isRightActive () {
      if (this.slideNo !== this.slidesCount) {
        return true
      }
      return false
    },
    isDownActive () {
      if (this.slide && this.slide.stepCount > 1 && this.slide.stepNo !== this.slide.stepCount) {
        return true
      }
      return false
    },
    isLeftActive () {
      if (this.slideNo !== 1) {
        return true
      }
      return false
    }
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
      opacity: 0.6
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
