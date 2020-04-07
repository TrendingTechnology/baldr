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
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'CursorArrows',
  computed: mapGetters(['slide', 'slidesCount', 'slideNo']),
  methods: {
    up () {
      console.log('up')
    },
    right () {
      console.log('right')
    },
    down () {
      console.log('down')
    },
    left () {
      console.log('left')
    },
    upClasses () {
      return {
        up: true,
        activated: this.isUpActive()
      }
    },
    rightClasses () {
      return {
        right: true,
        activated: this.isRightActive()
      }
    },
    downClasses () {
      return {
        down: true,
        activated: this.isDownActive()
      }
    },
    leftClasses () {
      return {
        left: true,
        activated: this.isLeftActive()
      }
    },
    isUpActive () {
      if (this.slide.stepCount > 1 && this.slide.stepNo !== 1) {
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
      if (this.slide.stepCount > 1 && this.slide.stepNo !== this.slide.stepCount) {
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
    color: $gray;
    font-size: 15vw;
    height: 2.1em;
    opacity: 0.2;
    position: fixed;
    right: 0.5vw;
    width: 2.1em;

    .activated {
      color: $blue;
      opacity: 0.9;
    }

    .baldr-icon {
      position: absolute;
      box-sizing: border-box;
      //border: 1px solid $yellow
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
