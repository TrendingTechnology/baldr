<template>
  <div
    class="
    vc_sample_list_master_preview
    slide-preview-fullscreen
    slide-preview-fix-typography
  "
  >
    <h2 v-if="heading" v-html="heading" />
    <ol>
      <li
        v-for="wrappedSample in samples"
        :key="wrappedSample.uri"
        v-html="wrappedSample.title"
      />
    </ol>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { WrappedUri } from '@bldr/presentation-parser'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class SampleListMasterPreview extends MasterPreview {
  masterName = 'sampleList'
  @Prop({
    type: String
  })
  heading!: string

  get samples (): WrappedUri[] {
    return this.slideNg.fields?.samples
  }
}
</script>
