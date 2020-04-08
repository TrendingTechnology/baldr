<template>
  <div class="vc_cursor_arrows">
    <svg
      :class="upClasses()"
      @click="up"
      viewBox="0 0 100 100"
    >
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="rightClasses()"
      @click="right"
      viewBox="0 0 100 100"
    >
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="downClasses()"
      @click="down"
      viewBox="0 0 100 100"
    >
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

    <svg
      :class="leftClasses()"
      @click="left"
      viewBox="0 0 100 100"
    >
      <path d="M 0,0 0,100 100,100 100,75 25,75 25,0 Z"/>
    </svg>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters, mapActions } = createNamespacedHelpers('lamp')

export default {
  name: 'CursorArrows',
  computed: mapGetters(['cursorArrowsTriggerStates', 'slide', 'slidesCount', 'slideNo']),
  methods: {
    ...mapActions(['highlightCursorArrow']),
    up () {
      this.highlightCursorArrow('up')
    },
    right () {
      this.highlightCursorArrow('right')
    },
    down () {
      this.highlightCursorArrow('down')
    },
    left () {
      this.highlightCursorArrow('left')
    },
    upClasses () {
      return {
        up: true,
        activated: this.isUpActive(),
        triggered: this.cursorArrowsTriggerStates.up
      }
    },
    rightClasses () {
      return {
        right: true,
        activated: this.isRightActive(),
        triggered: this.cursorArrowsTriggerStates.right
      }
    },
    downClasses () {
      return {
        down: true,
        activated: this.isDownActive(),
        triggered: this.cursorArrowsTriggerStates.down
      }
    },
    leftClasses () {
      return {
        left: true,
        activated: this.isLeftActive(),
        triggered: this.cursorArrowsTriggerStates.left
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
    //border: 1px solid $blue;
    bottom: 0.5vw;
    box-sizing: border-box;
    font-size: 3vw;
    height: 2.1em;
    position: fixed;
    left: 93vw;
    width: 2.1em;

    svg {
      position: absolute;
      box-sizing: border-box;
      //border: 1px solid $yellow
      opacity: 0.1;
      fill: $gray;
      transition-property: fill, opacity;
      transition-duration: 0.05s;
      width: 0.7em;
      height: 0.7em;
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
      top: 0.2em;
      left: 0.7em;
      transform: rotate(135deg);
    }

    .right {
      top: 0.7em;
      left: 1.2em;
      transform: rotate(225deg);
    }

    .down {
      top: 1.2em;
      left: 0.7em;
      transform: rotate(315deg);
    }

    .left {
      top: 0.7em;
      left: 0.2em;
      transform: rotate(405deg);
    }
  }
</style>
