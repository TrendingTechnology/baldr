<template>
  <div class="vc_wave_form">
    <img
      :src="asset.waveformHttpUrl"
      v-if="asset.waveformHttpUrl"
    />
  </div>
</template>

<script>
export default {
  props: {
    asset: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
  .vc_wave_form {
    img {
      filter: invert(100%);
      opacity: 0.4;
      height: 10vw;
    }
  }
</style>
