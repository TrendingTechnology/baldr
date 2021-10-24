<template>
  <div class="vc_instrument_master">
    <img class="img-contain" :src="asset.httpUrl" />
    <p class="name important">{{ asset.yaml.name }}</p>
    <p
      class="info-box font-shadow smaller"
      v-if="asset.yaml.description"
      v-html="asset.yaml.description"
    ></p>
    <horizontal-play-buttons
      :samples="asset.yaml.audioSamples"
      class="left-bottom-corner"
      v-if="asset.yaml.audioSamples"
    />
    <external-sites :asset="asset" />
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import ExternalSites from '@/components/reusable/ExternalSites.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class InstrumentMasterMain extends Vue {
  @Prop(Object)
  readonly asset!: object
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
}
</style>
