<template>
  <div
    class="
    vc_instrument_master_preview
    slide-preview-fullscreen
  "
  >
    <img class="img-contain" :src="asset.httpUrl" />
    <p class="important">{{ asset.yaml.name }}</p>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

@Component
export default class InstrumentMasterPreview extends Vue {
  @Prop(Object)
  readonly asset!: object
}
</script>

<style lang="scss">
.vc_instrument_master_preview {
  img {
    object-position: right bottom;
  }

  p {
    color: $orange;
    font-size: 2em;
    margin: 0;
    padding-left: 1em;
    position: absolute;
    top: 2em;
    width: 100%;
  }
}
</style>
