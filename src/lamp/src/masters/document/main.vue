<template>
  <div class="vc_document_master">
    <pdf-viewer
      :page="navNos.stepNo"
      :src="asset.httpUrl"
      ref="pdfViewer"
    />
  </div>
</template>

<script>
import PdfViewer from 'vue-pdf'

export default {
  props: {
    asset: {
      type: Object
    }
  },
  components: {
    PdfViewer
  }
}
</script>
