<template>
  <div class="vc_document_master">
    <pdf-viewer
      :page="pageComputed"
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
    },
    page: {
      type: Number
    }
  },
  components: {
    PdfViewer
  },
  computed: {
    pageComputed () {
      if (this.page != null) {
        return this.page
      }
      return this.navigationNumbers.stepNo
    }
  }
}
</script>
