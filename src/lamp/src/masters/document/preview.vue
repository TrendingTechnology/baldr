<template>
  <div
    class="
      vc_document_master_preview
      slide-preview-fullscreen
    "
  >
    <pdf-viewer :src="asset.httpUrl"/>
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
