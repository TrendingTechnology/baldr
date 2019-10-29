<template>
  <div class="vc_slide_number" b-ui-theme="default">

    <span v-if="stepCount > 1">
      <plain-icon color="white" name="steps"/>
      <span class="number">{{ stepNo }}</span>
      <span class="count"> / {{ stepCount }}</span>
    </span>

    <span v-if="slideNoCurrent">
      <plain-icon color="white" name="slides"/>
      <span class="number">{{ slideNoCurrent }}</span>
      <span class="count"> / {{ slidesCount }}</span>
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'SlideNumber',
  computed: {
    ...mapGetters(['slideNoCurrent', 'slidesCount']),
    slideCurrent () {
      const slide = this.$store.getters['presentation/slideCurrent']
      if (slide) {
        return slide
      }
      return null
    },
    stepNo () {
      if (this.slideCurrent) {
        return this.slideCurrent.renderData.stepNoCurrent
      }
      return 1
    },
    stepCount () {
      if (this.slideCurrent) {
        return this.slideCurrent.renderData.stepCount
      }
      return 1
    }
  }
}
</script>

<style lang="scss" scoped>
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
