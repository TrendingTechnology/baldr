<template>
  <div class="vc_playable_selector">
    <playable-selector-button
      v-for="simpleAsset in filteredSimpleAssets"
      :key="simpleAsset.uuid"
      :simple-asset="simpleAsset"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { data, SimpleAssetData } from '../../app'

import PlayableSelectorButton from './PlayableSelectorButton.vue'

export const eventBus = new Vue()

@Component({ components: { PlayableSelectorButton } })
export default class PlayableSelector extends Vue {
  @Prop()
  simpleAssets!: SimpleAssetData[]

  @Prop()
  mimeType!: 'audio' | 'video'

  get filteredSimpleAssets (): SimpleAssetData[] {
    let simpleAssets: SimpleAssetData[]
    if (this.simpleAssets != null) {
      simpleAssets = this.simpleAssets
    } else {
      simpleAssets = Object.values(data)
    }

    if (this.mimeType != null) {
      simpleAssets = simpleAssets.filter((simpleAsset: SimpleAssetData) => {
        return this.mimeType === simpleAsset.mimeType
      })
    }

    return simpleAssets
  }

  selectPlayable (uuid: string) {
    eventBus.$emit('select-playable', uuid)
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
