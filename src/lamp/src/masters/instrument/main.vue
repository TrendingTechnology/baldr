<template>
  <div class="vc_instrument_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p class="name important">{{ asset.name }}</p>
    <p class="info-box font-shadow smaller" v-if="asset.description" v-html="asset.description"></p>
    <horizontal-play-buttons
      :wrapped-samples="wrappedSamples"
    />
    <external-sites :asset="asset"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'

export default {
  props: {
    asset: {
      type: Object
    },
    wrappedSamples: {
      type: Object
    }
  },
  components: {
    ExternalSites
  }
}
</script>

<style lang="scss">
  .vc_instrument_master {
    img {
      object-position: right bottom;
    }

    .name {
      margin: 0em;
      position: absolute;
      font-size: 4em;
      top: 0.5em;
      width: 100%;
      padding-left: 1em;
      color: $orange;
    }

    .info-box {
      left: 3em;
      top: 30vh;
    }

    .vc_horizontal_play_buttons {
      position: absolute;
      bottom: 0.5em;
      left: 0.5em;
    }
  }
</style>
