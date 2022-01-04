<template>
  <div class="vc_playable_base_demo">
    <code>PlayableBase</code> has no template, so we use the componente
    <code>PlayButton</code>.

    <h1><code>src</code> specified as a uri</h1>
    <play-button :src="uri" />

    <h1><code>src</code> specified as a Playable</h1>
    <play-button :src="playable" />

    <h1><code>src</code> specified as a Sample</h1>
    <play-button :src="sample" />

    <h1><code>src</code> specified as a Asset</h1>
    <play-button :src="asset" />

    <h1><code>src</code> specified as a null</h1>
    <play-button :src="null" />
    The PlayButton is not shown.
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { player, Playable } from '@bldr/player'

import { data } from '../../app'
import { Asset, Sample } from '@bldr/media-resolver-ng'

@Component
export default class PlayableBaseDemo extends Vue {
  uri!: string
  playable!: Playable
  sample!: Sample
  asset!: Asset

  data () {
    return {
      uri: null,
      playable: null,
      sample: null,
      asset: null
    }
  }

  async mounted () {
    this.uri = data.gebadet.uuid

    this.playable = await player.resolvePlayable(data.tor.uuid)

    const egmontPlayable = await player.resolvePlayable(data.egmont.uuid)
    this.sample = egmontPlayable.sample

    const kaktusPlayable = await player.resolvePlayable(data.kaktus.uuid)
    this.asset = kaktusPlayable.sample.asset
  }
}
</script>

<style lang="scss">
.vc_playable_base_demo {
  .vc_play_button {
    font-size: 5em;
  }
}
</style>
