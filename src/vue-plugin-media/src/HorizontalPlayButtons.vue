<template>
  <div
    class="vc_horizontal_play_buttons"
    v-if="wrappedSamplesNormalized"
  >
    <span
      v-for="wrapped in samplesNormalized"
      :key="wrapped.sample.uri"
    >
      <play-button
        :sample="wrapped.sample"
      />
      <span v-if="showTitlesNormalized">{{ wrapped.title }}</span>
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
    showTitles: {
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
      if (this.samples) return new WrappedSamples(this.samples)
    },
    showTitlesNormalized () {
      if (this.wrappedSamplesNormalized.isTitleSet) return true
      return this.showTitles
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_horizontal_play_buttons {
    font-size: 2.5vw;
  }
</style>
