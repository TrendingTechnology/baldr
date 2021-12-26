<template>
  <div
    class="
    vc_person_master_preview
    slide-preview-fullscreen
  "
  >
    <img class="img-contain" :src="asset.httpUrl" />
    <div class="title-box">
      <p class="person important transparent-background font-shadow">
        {{ asset.yaml.name }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset } from '@bldr/presentation-parser'

import MasterPreview from '../../components/reusable/MasterPreview.vue'

@Component
export default class PersonMasterPreview extends MasterPreview {
  masterName = 'person'

  @Prop({
    type: Object,
    required: true
  })
  asset: Asset
}
</script>

<style lang="scss">
.vc_person_master_preview {
  .title-box {
    bottom: 1em;
    position: absolute;
    right: 0;
    width: 100%;

    .person {
      font-size: 2em;
      margin: 0;
      padding-right: 1em;
      text-align: right;
    }
  }
}
</style>
