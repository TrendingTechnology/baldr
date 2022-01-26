<template>
  <div
    class="
    vc_song_master_preview
    slide-preview-fullscreen
  "
  >
    <h2>{{ title }}</h2>
    <img :src="imageHttpUrl" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class SongMasterPreview extends MasterPreview {
  masterName = 'song'

  @Prop({
    type: String,
    required: true
  })
  imageHttpUrl!: string

  @Prop({
    type: String
  })
  title!: string
}
</script>

<style lang="scss">
.vc_song_master_preview {
  h2 {
    position: absolute;
    text-align: center;
    width: 100%;
  }

  img {
    height: 90%;
    margin: 5%;
    object-fit: contain;
    width: 90%;
  }
}
</style>
