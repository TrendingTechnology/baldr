<template>
  <div class="vc_video_master">
    <div class="meta-info" v-if="showMeta">
      <div class="title" v-html="title" v-if="title" />
      <div class="description small" v-html="description" v-if="description" />
    </div>
    <div id="video_master-container" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../../components/reusable/MasterMain.vue'

@Component
export default class VideoMasterMain extends MasterMain {
  masterName = 'video'

  @Prop({
    type: String,
    required: true
  })
  httpUrl: string

  @Prop({
    type: String
  })
  previewHttpUrl: string

  @Prop({
    type: String
  })
  title: string

  @Prop({
    type: String
  })
  description: string

  @Prop({
    type: Boolean
  })
  showMeta: boolean
}
</script>

<style lang="scss">
.vc_video_master {
  text-align: center;

  video {
    bottom: 0;
    height: 100%;
    left: 0;
    object-fit: contain;
    object-position: left bottom;
    position: absolute;
    width: 100%;
  }

  .meta-info {
    text-align: left;
    position: absolute;
    top: 2vw;
    left: 6vw;
    z-index: 1;
  }
}
</style>
