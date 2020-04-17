<template>
  <div class="vc_score_sample_master">
    <h1 v-if="heading" v-html="heading"/>
    <img :src="scoreMediaFile.getMultiPartHttpUrlByNo(navNos.stepNo)"/>
    <play-button v-if="audioSample" :sample="audioSample"/>
    <external-sites :asset="scoreMediaFile"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'

export default {
  props: {
    heading: {
      type: String
    },
    scoreMediaFile: {
      type: Object
    },
    audioSample: {
      type: Object
    }
  },
  components: {
    ExternalSites
  }
}
</script>

<style lang="scss">
  .vc_score_sample_master {
    padding: 3em 3em;
    background-color: white;
    text-align: center;

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
      width: 92%;
      height: 90%;
    }
  }
</style>
