<template>
  <button
    class="vc_playable_selector_button"
    v-on:click="selectPlayable(testAsset.uuid)"
  >
    {{ label }}
  </button>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { TestAsset } from '../../app'

import { eventBus } from './PlayableSelector.vue'

@Component
export default class HorizontalPlayButtonDemo extends Vue {
  @Prop()
  testAsset!: TestAsset

  selectPlayable (uuid: string) {
    eventBus.$emit('select-playable', uuid)
  }

  get label () {
    if (this.testAsset.title != null) {
      return this.testAsset.title
    }
    if (this.testAsset.ref != null) {
      return this.testAsset.ref
    }
    return this.testAsset.uuid
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
