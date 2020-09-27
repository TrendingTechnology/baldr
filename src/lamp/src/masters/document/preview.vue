<template>
  <div
    class="
      vc_document_master_preview
      slide-preview-fullscreen
    "
  >
    <pdf-viewer :page="pageComputed" :src="asset.httpUrl"/>
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
      if (this.page) return this.page
      return 1
    }
  }
}
</script>
