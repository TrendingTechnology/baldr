<template>
  <div class="vc_score_sample_master">
    <h1 v-if="heading" v-html="heading" />
    <img :src="asset.getMultiPartHttpUrlByNo(navigationNumbers.stepNo)" />
    <play-button
      class="left-bottom-corner"
      v-if="audioUri"
      :src="audioUri"
    />
    <external-sites :asset="asset" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset } from '@bldr/presentation-parser'
import { player } from '@bldr/player'

import MasterMain from '../MasterMain.vue'
import ExternalSites from '@/components/reusable/ExternalSites.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class ScoreSampleMasterMain extends MasterMain {
  masterName = 'scoreSample'

  @Prop({
    type: String
  })
  heading: string

  @Prop({
    type: Object
  })
  asset: Asset

  @Prop({
    type: Object
  })
  audioSample: Asset

  get audioUri (): string | undefined {
    return this.slide.props.audio
  }

  afterSlideNoChange (): void {
    if (!this.isPublic) {
      return
    }
    if (this.slide.props.audio == null) {
      return
    }
    player.load(this.slide.props.audio)
  }
}
</script>

<style lang="scss">
.vc_score_sample_master {
  padding: 0.4em;
  background-color: white;
  text-align: center;
  height: 100%;

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
    width: 100%;
    height: 100%;
    position: absolute;
    object-position: 50% 50%;
  }
}
</style>
