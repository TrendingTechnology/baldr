<template>
  <div class="vc_component_wave_form_demo">
    <h1>Test component “WaveForm”</h1>
    <wave-form :src="src"></wave-form>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import { WaveForm } from '@bldr/player'

import DemoBase from '../DemoBase.vue'

@Component({ components: { WaveForm } })
export default class ComponentWaveFormDemo extends DemoBase {}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
