<template>
  <div
    class="
    vc_score_sample_master_preview
    slide-preview-fullscreen
  "
  >
    <h3 v-if="heading" v-html="heading" />
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
    type: String
  })
  heading!: string

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
  background-color: white;

  h3 {
    background: rgba($yellow, 0.2);
    left: 0;
    padding: 0.3em 0;
    position: absolute;
    text-align: center;
    top: 0.3em;
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
