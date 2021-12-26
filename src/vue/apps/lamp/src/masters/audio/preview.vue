<template>
  <div
    class="
    vc_audio_master_preview
    slide-preview-fullscreen
  "
  >
    <img
      :src="previewHttpUrl"
      class="image-contain"
      v-if="previewHttpUrl != null"
    />
    <img
      :src="waveformHttpUrl"
      class="waveform image-contain"
      v-if="previewHttpUrl == null && waveformHttpUrl != null"
    />
    <div class="metadata">
      <p class="composer person" v-if="composer" v-html="composer" />
      <p class="title piece" v-if="title" v-html="title" />
    </div>
    <slide-preview-play-button />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../../components/reusable/MasterPreview.vue'

@Component
export default class AudioMasterPreview extends MasterPreview {
  masterName = 'audio'

  @Prop({
    type: String
  })
  previewHttpUrl: string

  @Prop({
    type: String
  })
  waveformHttpUrl: string

  @Prop({
    type: String,
    required: true
  })
  title: string

  @Prop({
    type: String
  })
  composer: string
}
</script>

<style lang="scss">
.vc_audio_master_preview {
  p {
    margin: 0;
  }

  .metadata {
    background-color: rgba(170, 170, 170, 0.6);
    bottom: 0;
    position: absolute;
    text-align: center;
    width: 100%;
  }

  .composer {
    font-size: 1.2em;
  }

  .title {
    font-size: 2em;
  }

  img.waveform {
    filter: invert(100%);
    opacity: 0.8;
  }
}
</style>
