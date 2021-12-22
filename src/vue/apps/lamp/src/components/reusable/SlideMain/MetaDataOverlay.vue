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
import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

@Component
export default class MetaDataOverlay extends Vue {
  @Prop({
    type: Object,
    required: true
  })
  slide: any

  get metaData () {
    return this.slide.metaData
  }

  get isVisible () {
    return this.$store.getters['lamp/showMetaDataOverlay']
  }
}
</script>

<style lang="scss">
.vc_meta_data_overlay {
  position: absolute;
  top: 0;
  left: 5em;
  padding: 1em;
  background: none !important;
  z-index: 2;

  .transparent-bg {
    background: rgba($green, 0.2);
    padding: 0.2em;
  }
}
</style>
