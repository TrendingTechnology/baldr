<template>
  <div class="vc_instrument_master">
    <img :src="imageHttpUrl">
    <p class="name transparent-background important">{{ name }}</p>
    <play-button v-if="sample" :sample="sample"/>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    imageHttpUrl: {
      type: String,
      required: true
    },
    sample: {
      type: Object
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_instrument_master {
    img {
      height: 100vh;
      right: 0;
      object-fit: contain;
      object-position: right bottom;
      position: absolute;
      top: 0;
      width: 100vw;
    }

    .name {
      position: absolute;
      font-size: 4em;
      top: 2em;
      width: 100%;
      padding-left: 2em;
      color: $black;
    }

    .vc_play_button {
      position: absolute;
      bottom: 0.5em;
      left: 0.5em;
    }
  }
</style>
