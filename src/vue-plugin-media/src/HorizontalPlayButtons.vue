<template>
  <div class="vc_horizontal_play_buttons">
    <span
        v-for="wrapped in samplesNormalized"
        :key="wrapped.sample.uri">
      <play-button
        :sample="wrapped.sample"
      />
      <span v-if="showTitleNormalized">{{ wrapped.title }}</span>
    </span>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue'
import { store, WrappedSamples } from './main.js'


export default {
  name: 'HorizontalPlayButtons',
  components: {
    PlayButton
  },
  props: {
    // Fuzzy input
    samples: {
      type: Array
    },
    // Instance of WrappedSamples
    wrappedSamples: {
      type: Object
    },
    showTitle: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    samplesNormalized () {
      return this.wrappedSamplesNormalized.samples
    },
    wrappedSamplesNormalized () {
      if (this.wrappedSamples) return this.wrappedSamples
      return new WrappedSamples(this.samples)
    },
    showTitleNormalized () {
      if (this.wrappedSamplesNormalized.isTitleSet) return true
      return this.showTitle
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_horizontal_play_buttons {

  }
</style>
