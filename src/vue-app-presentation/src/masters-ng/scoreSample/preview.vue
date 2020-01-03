<template>
  <div class="vc_score_sample_master_preview">
    <img :src="scoreHttpUrl"/>
  </div>
</template>

<script>
export default {
  props: {
    scoreHttpUrl: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_score_sample_master_preview {
    width: 100%;
    height: 100%;
    background-color: $white;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
</style>
