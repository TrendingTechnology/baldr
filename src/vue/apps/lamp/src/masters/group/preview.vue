<template>
  <div
    class="
    vc_group_master_preview
    slide-preview-fullscreen
  "
  >
    <img class="img-contain" :src="asset.httpUrl" />
    <div class="title-box">
      <p class="group important transparent-background font-shadow">
        {{ asset.yaml.name }}
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset } from '@bldr/presentation-parser'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class GroupMasterPreview extends MasterPreview {
  masterName = 'group'

  @Prop({
    type: Object,
    required: true
  })
  asset: Asset
}
</script>

<style lang="scss">
.vc_group_master_preview {
  .title-box {
    bottom: 1em;
    position: absolute;
    right: 0;
    width: 100%;

    .group {
      font-size: 2em;
      margin: 0;
      padding-right: 0.5em;
      text-align: right;
    }
  }
}
</style>
