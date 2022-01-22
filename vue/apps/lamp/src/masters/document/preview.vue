<template>
  <div
    class="
      vc_document_master_preview
      slide-preview-fullscreen
    "
  >
    <img
      v-if="asset.previewHttpUrl"
      :src="asset.previewHttpUrl"
      class="image-contain"
    />
    <pdf-viewer v-else :page="pageComputed" :src="asset.httpUrl" />
  </div>
</template>

<script lang="ts">
import PdfViewer from 'vue-pdf'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset } from '@bldr/presentation-parser'

import MasterPreview from '../MasterPreview.vue'

@Component({
  components: {
    PdfViewer
  }
})
export default class DocumentMasterPreview extends MasterPreview {
  masterName = 'document'

  @Prop({
    type: Object
  })
  asset!: Asset

  @Prop({
    type: Number
  })
  page!: number

  get pageComputed (): number {
    if (this.page != null) {
      return this.page
    }
    return 1
  }
}
</script>
