<template>
  <div class="vc_component_playable_text_demo">
    <h1>Test component “PlayableText”</h1>
    <playable-text :src="src"/>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import { PlayableText } from '@bldr/player'

import DemoBase from '../DemoBase.vue'

@Component({ components: { PlayableText } })
export default class PlayalbeTextDemo extends DemoBase {}
</script>
