<template>
  <div class="vc_slides_preview_play_button valign-wrapper">
    <plain-icon class="valign-center font-shadow" name="player-play" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class SlidePreviewPlayButton extends Vue {}
</script>

<style lang="scss">
.vc_slides_preview_play_button {
  height: 100%;
  left: 0;
  position: absolute;
  text-align: center;
  top: 0;
  width: 100%;

  .baldr-icon {
    font-size: 6em;
    opacity: 0.4;
  }
}
</style>
