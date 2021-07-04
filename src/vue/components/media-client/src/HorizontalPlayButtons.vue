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
        v-html="wrappedSample.titleSafe"
      />
    </span>
  </div>
</template>

<script>
import PlayButton from './PlayButton.vue'
import { mediaResolver } from './main.js'

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
    },
    loadFirstSample: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    samplesNormalized () {
      for (const wrappedSample of this.wrappedSampleListNormalized.samples) {
        if (!wrappedSample.sample) {
          throw new Error(`Object has no sample object. Maybe it is no audio file. URI: ${wrappedSample.uri}`)
        }
      }
      return this.wrappedSampleListNormalized.samples
    },
    firstSample () {
      return this.samplesNormalized[0].sample
    },
    wrappedSampleListNormalized () {
      if (this.wrappedSampleList != null) {
        return this.wrappedSampleList
      }
      if (this.samples != null) {
        return mediaResolver.getWrappedSampleList(this.samples)
      }
    },
    showTitlesNormalized () {
      if (this.wrappedSampleListNormalized.isTitleSetManually) {
        return true
      }
      return this.showTitles
    }
  },
  mounted () {
    this.loadSample()
  },
  methods: {
    loadSample () {
      this.$media.player.load(this.firstSample)
    }
  },
  watch: {
    samples (val, oldVal) {
      this.loadSample()
    },
    wrappedSampleList (val, oldVal) {
      this.loadSample()
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
