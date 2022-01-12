<template>
  <div class="vc_component_video_screen_demo">
    <h1>Test component “Videoscreen”</h1>

    <h2>Select videos</h2>
    <video-screen :src="src" />

    <h2>Preconfigured</h2>

    <video-screen :src="testData.oops.uuid" />
  </div>
</template>

<script lang="ts">
import DemoBase from './DemoBase.vue'
import Component from 'vue-class-component'

@Component
export default class VideoScreenDemo extends DemoBase {}
</script>
