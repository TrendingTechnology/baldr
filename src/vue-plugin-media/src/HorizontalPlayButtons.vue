<template>
  <div
    class="vc_horizontal_play_buttons"
    v-if="wrappedSamplesNormalized"
  >
    <span
      v-for="wrappedSample in samplesNormalized"
      :key="wrappedSample.sample.uri"
    >
      <play-button
        :sample="wrappedSample.sample"
      />
      <span class="manual-title" v-if="showTitlesNormalized || wrappedSample.isTitleSetManually">{{ wrappedSample.title }}</span>
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
      if (this.wrappedSamplesNormalized.isTitleSetManually) return true
      return this.showTitles
    }
  }
}
</script>

<style lang="scss">
  .vc_horizontal_play_buttons {
    .manual-title {
      padding: 0 0.5em;
      transform: translateY(-0.4em);
      display: inline-block;
    }
  }
</style>
