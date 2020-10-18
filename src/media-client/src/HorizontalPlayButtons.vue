<template>
  <div
    class="vc_horizontal_play_buttons"
    v-if="wrappedSampleListNormalized"
  >
    <span
      v-for="wrappedSample in samplesNormalized"
      :key="wrappedSample.sample.uri"
    >
      <play-button
        :sample="wrappedSample.sample"
      />
      <span
        class="manual-title sans"
        v-if="showTitlesNormalized || wrappedSample.isTitleSetManually"
        v-html="wrappedSample.title"
      />
    </span>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue'
import { store, WrappedSampleList } from './main.js'

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
    // Instance of WrappedSampleList
    wrappedSampleList: {
      type: Object
    },
    showTitles: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    samplesNormalized () {
      return this.wrappedSampleListNormalized.samples
    },
    wrappedSampleListNormalized () {
      if (this.wrappedSampleList) return this.wrappedSampleList
      if (this.samples) return new WrappedSampleList(this.samples)
    },
    showTitlesNormalized () {
      if (this.wrappedSampleListNormalized.isTitleSetManually) return true
      return this.showTitles
    }
  }
}
</script>

<style lang="scss">
  .vc_horizontal_play_buttons {
    .manual-title {
      padding: 0 0.5em;
      transform: translateY(-0.2em);
      display: inline-block;
    }
  }
</style>
