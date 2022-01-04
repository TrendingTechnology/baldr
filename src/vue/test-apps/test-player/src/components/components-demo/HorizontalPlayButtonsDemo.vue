<template>
  <div class="vc_horizontal_play_buttons_demo">
    <h1>Test component “HorizontalPlayButtons”</h1>

    <h2>src=string</h2>
    <horizontal-play-buttons :src="testData.mannenberg.uuid" />

    <h2>src=[string, string]</h2>
    <horizontal-play-buttons
      :src="[testData.aicha.uuid, testData.mannenberg.uuid]"
    />

    <h2>With titles</h2>
    <horizontal-play-buttons
      :src="[
        { uri: testData.aicha.uuid, title: 'Title 1' },
        { uri: testData.mannenberg.uuid, title: 'Title 2' }
      ]"
    />

    <h2>Mixed input</h2>
    <horizontal-play-buttons
      :src="[
        { uri: testData.kaktus.uuid, title: 'Title 1' },
        testData.gebadet.uuid
      ]"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'

import DemoBase from './DemoBase.vue'

@Component
export default class HorizontalPlayButtonsDemo extends DemoBase {}
</script>

<style lang="scss">
.vc_horizontal_play_buttons_demo {
  .vc_play_button {
    font-size: 5em;
  }
}
</style>
