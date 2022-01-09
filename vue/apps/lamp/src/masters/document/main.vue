<template>
  <div class="vc_document_master">
    <pdf-viewer :page="pageComputed" :src="asset.httpUrl" ref="pdfViewer" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import PdfViewer from 'vue-pdf'

import { Asset } from '@bldr/presentation-parser'

import MasterMain from '../MasterMain.vue'

@Component({
  components: { PdfViewer }
})
export default class DocumentMasterMain extends MasterMain {
  masterName = 'document'

  @Prop({
    type: Object
  })
  asset: Asset

  @Prop({
    type: Number
  })
  page: number

  get pageComputed (): number {
    if (this.page != null) {
      return this.page
    }
    // this.navigationNumbers.stepNo -> NaN?
    if (
      typeof this.navigationNumbers.stepNo === 'number' &&
      this.navigationNumbers.stepNo > 1
    ) {
      return this.navigationNumbers.stepNo
    }
    return 1
  }
}
</script>
