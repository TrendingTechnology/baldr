<template>
  <div class="slide-number" b-ui-theme="default">

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
export default {
  name: 'SlideNumber',
  computed: {
    slideNo () {
      return this.$store.getters.slideNoCurrent
    },
    slidesCount () {
      return this.$store.getters.slidesCount
    },
    slideCurrent () {
      if (this.$store.getters.slideCurrent) {
        return this.$store.getters.slideCurrent
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
  .slide-number {
    top: 1vw;
    font-family: $font-family-sans;
    font-size: 1vw;
    right: 1vw;
    opacity: 0.2;
    position: fixed;
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
