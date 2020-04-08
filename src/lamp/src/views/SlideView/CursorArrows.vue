<template>
  <div class="vc_cursor_arrows">
    <plain-icon
      name="chevron-up"
      :class="upClasses()"
      @click.native="up"
    />
    <plain-icon
      name="chevron-right"
      :class="rightClasses()"
      @click.native="right"
    />
    <plain-icon
      name="chevron-down"
      :class="downClasses()"
      @click.native="down"
    />
    <plain-icon
      name="chevron-left"
      :class="leftClasses()"
      @click.native="left"
    />
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
    //border: 3px solid $blue;
    bottom: 0.5vw;
    box-sizing: border-box;
    font-size: 15vw;
    height: 2.1em;
    position: fixed;
    right: 0.5vw;
    width: 2.1em;

    .baldr-icon {
      position: absolute;
      box-sizing: border-box;
      //border: 1px solid $yellow
      opacity: 0.1;
      color: $gray;
      transition-property: color, opacity;
      transition-duration: 0.2s;
    }

    s.baldr-icon.activated:hover {
      opacity: 0.6
    }

    .baldr-icon.activated {
      color: $blue;
      opacity: 0.4;
    }

    .baldr-icon.triggered {
      color: $orange;
      opacity: 1;
      transition-property: color, opacity;
      transition-duration: 0.2s;
    }

    .up {
      top: 0em;
      left: 0.5em;
    }

    .right {
      top: 0.5em;
      left: 1em;
    }

    .down {
      top: 1em;
      left: 0.5em;
    }

    .left {
      top: 0.5em;
      left: 0em;
    }
  }
</style>
