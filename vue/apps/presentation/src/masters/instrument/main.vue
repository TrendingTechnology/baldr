<template>
  <div class="vc_instrument_master">
    <img class="img-contain" :src="asset.httpUrl" />
    <p class="name important">{{ asset.meta.name }}</p>
    <p
      class="info-box font-shadow smaller"
      v-if="asset.meta.description"
      v-html="asset.meta.description"
    ></p>
    <horizontal-play-buttons
      :src="asset.meta.audioSamples"
      class="left-bottom-corner"
      v-if="asset.meta.audioSamples"
    />
    <external-sites :asset="asset" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset } from '@bldr/presentation-parser'

import ExternalSites from '@/components/reusable/ExternalSites.vue'
import MasterMain from '../MasterMain.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class InstrumentMasterMain extends MasterMain {
  masterName = 'instrument'

  @Prop({
    type: Object
  })
  readonly asset!: Asset
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
