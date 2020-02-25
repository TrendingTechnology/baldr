<template>
  <div class="vc_horizontal_play_buttons">
    <play-button
      :sample="sample"
      v-for="sample in samples"
      :key="sample.uri"
    />
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue'

export default {
  name: 'HorizontalPlayButtons',
  components: {
    PlayButton
  },
  props: {
    samples: {
      type: Array,
      required: true
    },
    showTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    samplesNormalized () {
      return this.samples
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_horizontal_play_buttons {

  }
</style>
