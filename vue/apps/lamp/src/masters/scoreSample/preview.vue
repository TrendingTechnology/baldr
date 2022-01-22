<template>
  <div
    class="
    vc_score_sample_master_preview
    slide-preview-fullscreen
  "
  >
    <img :src="scoreHttpUrl" />
    <slide-preview-play-button v-if="hasAudio" />
    <plain-icon
      class="transparent-background slide-preview-indicator-icon"
      v-if="isMultiPart"
      name="multi-part"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class ScoreSampleMasterPreview extends MasterPreview {
  masterName = 'scoreSample'

  @Prop({
    type: String,
    required: true
  })
  scoreHttpUrl!: string

  @Prop({
    type: Boolean
  })
  hasAudio!: boolean

  @Prop({
    type: Boolean
  })
  isMultiPart!: boolean
}
</script>

<style lang="scss">
.vc_score_sample_master_preview {
  img {
    height: 90%;
    margin: 5%;
    object-fit: contain;
    width: 90%;
  }
}
</style>
