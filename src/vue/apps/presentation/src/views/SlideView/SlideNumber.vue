<template>
  <div class="slide-number">
    <span v-if="slideNo">
      <material-icon color="white" name="slides"/>
      <span class="number">{{ slideNo }}</span>
      <span class="count"> / {{ slidesCount }}</span>
    </span>

    <span v-if="stepCount > 1">
      <material-icon name="steps"/>
      <span class="number">{{ stepNo }}</span>
      <span class="count"> / {{ stepCount }}</span>
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
    stepNo () {
      return this.$store.getters.slideCurrent.master.stepNoCurrent
    },
    stepCount () {
      return this.$store.getters.slideCurrent.master.stepCount
    }
  }
}
</script>

<style lang="scss" scoped>
  .slide-number {
    bottom: 1vw;
    font-family: $font-family-sans;
    font-size: 3vw;
    left: 1vw;
    opacity: 0.5;
    position: absolute;
    z-index: 1;

    .number, .count {
      display: inline-block;
    }

    .number {
      text-align: right;
      width: 0.8em;
    }

    .count {
      font-size: 2vw;
      padding-left: 0.2em;
      text-align: left;
      width: 2em;
    }
  }
</style>
