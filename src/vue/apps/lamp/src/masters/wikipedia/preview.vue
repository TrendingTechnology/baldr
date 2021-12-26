<template>
  <div
    class="
    vc_wikipedia_master_preview
    slide-preview-valign-center
    slide-preview-fullscreen
  "
  >
    <img v-if="thumbnailUrl" :src="thumbnailUrl" class="image-contain" />
    <img v-else src="./wikipedia.png" class="image-contain" />

    <div class="text-overlay">
      {{ titleNoUnderscores }}
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { wikipediaMaster } from '@bldr/presentation-parser'

import MasterPreview from '../../components/reusable/MasterPreview.vue'

@Component
export default class WikipediaMasterPreview extends MasterPreview {
  masterName = 'wikipedia'

  data (): { thumbnailUrl: null | string } {
    return {
      thumbnailUrl: null
    }
  }

  @Prop({
    type: String,
    required: true
  })
  title: string

  @Prop({
    type: String,
    required: true
  })
  id: string

  @Prop({
    type: String
  })
  language: string

  thumbnailUrl: string

  get titleNoUnderscores (): string {
    return wikipediaMaster.formatTitleHumanReadable(this.title)
  }

  async setThumbnailUrl (): Promise<void> {
    this.thumbnailUrl = await wikipediaMaster.queryFirstImage(
      this.title,
      this.language
    )
  }

  mounted (): void {
    this.setThumbnailUrl()
  }
}
</script>

<style lang="scss">
.vc_wikipedia_master_preview {
  background-color: scale-color($gray, $lightness: 30%) !important;
  color: $black !important;
  font-size: 3em;

  .text-overlay {
    background-color: rgba($white, 0.8);
    bottom: 0;
    left: 0;
    overflow: hidden;
    padding: 0 0 0.2em 0.2em;
    position: absolute;
    text-align: left;
    text-decoration: underline;
    text-overflow: ellipsis;
    text-shadow: 0 0 0.1em $white;
    white-space: nowrap;
    width: 100%;
  }
}
</style>
