<template>
  <button
    class="vc_playable_selector_button"
    v-on:click="selectPlayable(simpleAsset.uuid)"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { SimpleAssetData } from '../../app'

import { eventBus } from './PlayableSelector.vue'

@Component
export default class PlayableSelectorButton extends Vue {
  @Prop()
  simpleAsset!: SimpleAssetData

  selectPlayable (uuid: string) {
    eventBus.$emit('select-playable', uuid)
  }

  get label () {
    if (this.simpleAsset.title != null) {
      return this.simpleAsset.title
    }
    if (this.simpleAsset.ref != null) {
      return this.simpleAsset.ref
    }
    return this.simpleAsset.uuid
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
