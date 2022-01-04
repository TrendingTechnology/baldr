<template>
  <div class="vc_component_video_screen_demo">
    <h1>Test component “Videoscreen”</h1>
    <video-screen :src="src" />
    <playable-selector mime-type="video" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import PlayableSelector from './PlayableSelector.vue'
import DemoBase from './DemoBase.vue'

@Component({ components: { PlayableSelector } })
export default class VideoScreenDemo extends DemoBase {}
</script>
