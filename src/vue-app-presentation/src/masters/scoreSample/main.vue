<template>
  <div class="vc_score_sample_master">
    <h1 v-if="heading" v-html="heading"/>
    <img :src="scoreHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    heading: {
      type: String
    },
    scoreHttpUrl: {
      type: String,
      required: true
    },
    audioHttpUrl: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_score_sample_master {
    padding: 4vh 4vw;
    background-color: white;

    h1 {
      left: 0;
      position: absolute;
      text-align: center;
      top: 1vw;
      width: 100%;
      background: rgba($yellow, 0.6);
    }

    img {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }

    .vc_play_button {
      position: absolute;
      bottom: 5vw;
      left: 1vw;
      z-index: 1;
    }
  }
</style>
