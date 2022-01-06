<template>
  <div v-if="isVisible" class="vc_meta_data_overlay" b-ui-theme="default">
    <h1 v-if="metaData.title" class="transparent-bg" v-html="metaData.title" />
    <p v-if="metaData.source" class="transparent-bg" v-html="metaData.source" />
    <p
      v-if="metaData.description"
      class="transparent-bg"
      v-html="metaData.description"
    />

    <pre v-if="slide.yamlMarkup"><code v-html="slide.yamlMarkup"/></pre>
    <div v-if="slide.texMarkup">
      <h2>TeX</h2>
      <pre><code v-html="slide.texMarkup"/></pre>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import { Slide } from '../../../content-file.js'

type SlideMeta = SlideNg['meta']

@Component
export default class MetaDataOverlay extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: Slide

  get metaData (): SlideMeta {
    return this.slide.metaData
  }

  get isVisible (): boolean {
    return this.$store.getters['lamp/showMetaDataOverlay']
  }
}
</script>

<style lang="scss">
.vc_meta_data_overlay {
  background: none !important;
  left: 5em;
  padding: 1em;
  position: absolute;
  top: 0;
  z-index: 2;

  .transparent-bg {
    background: rgba($green, 0.2);
    padding: 0.2em;
  }
}
</style>
