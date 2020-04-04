<template>
  <div class="vc_slide_number" b-ui-theme="default">

    <span v-if="stepCount > 1">
      <plain-icon color="white" name="steps"/>
      <span class="number">{{ stepNo }}</span>
      <span class="count"> / {{ stepCount }}</span>
    </span>

    <span v-if="slideNo">
      <plain-icon color="white" name="slides"/>
      <span class="number">{{ slideNo }}</span>
      <span class="count"> / {{ slidesCount }}</span>
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlideNumber',
  computed: {
    ...mapGetters(['slideNo', 'slidesCount']),
    slide () {
      const slide = this.$store.getters['lamp/slide']
      if (slide) {
        return slide
      }
      return null
    },
    stepNo () {
      if (this.slide) {
        return this.slide.stepNo
      }
      return 1
    },
    stepCount () {
      if (this.slide) {
        return this.slide.stepCount
      }
      return 1
    }
  }
}
</script>

<style lang="scss">
  .vc_slide_number {
    font-family: $font-family-sans;
    font-size: 2vw;
    opacity: 0.2;
    position: fixed;
    right: 1vw;
    top: 1vw;
    z-index: 1;

    .number, .count {
      display: inline-block;
    }

    .number {
      text-align: right;
      width: 0.9em;
    }

    .count {
      font-size: 0.5em;
      padding-left: 0.2em;
      text-align: left;
      width: 2em;
    }

    .baldr-icon {
      font-size: 0.6em;
    }
  }
</style>
