<template>
  <div class="vc_score_sample_master">
    <h1 v-if="heading" v-html="heading"/>
    <img :src="scoreHttpUrlCurrent"/>
    <play-button v-if="audioSample" :sample="audioSample"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    heading: {
      type: String
    },
    score: {
      type: Object
    },
    scoreHttpUrl: {
      type: String,
      required: true
    },
    audioSample: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(['slideCurrent']),
    scoreHttpUrlCurrent () {
      return this.score.multiPartHttpUrl(this.slideCurrent.renderData.stepNoCurrent)
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_score_sample_master {
    padding: 4vh 4vw;
    background-color: white;

    h1 {
      background: rgba($yellow, 0.2);
      left: 0;
      padding: 0.3em 0;
      position: absolute;
      text-align: center;
      top: 0.3em;
      width: 100%;
    }

    img {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

    .vc_play_button {
      font-size: 2em;
      position: absolute;
      bottom: 0.5em;
      left: 0.5em;
      z-index: 1;
    }
  }
</style>
