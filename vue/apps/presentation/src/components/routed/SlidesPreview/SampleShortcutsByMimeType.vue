<template>
  <div class="vc_sample_shortcuts_by_mime_type" v-if="hasSamples">
    <h3>{{ mimeType }}</h3>
    <div v-for="sample in samples" :key="sample.ref">
      <playable-text :src="sample.ref"></playable-text>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Sample } from '@bldr/presentation-parser'

@Component
export default class SampleShortcutsByMimeType extends Vue {
  @Prop({ required: true })
  mimeType!: 'audio' | 'video'

  get samples (): Record<string, Sample> {
    return this.$store.getters['presentation/media/sampleShortcuts'](this.mimeType)
  }

  get hasSamples (): boolean {
    return this.samples != null && Object.keys(this.samples).length > 0
  }
}
</script>

<style lang="scss">
.vc_sample_shortcuts_by_mime_type {
  width: 30%;
}
</style>
