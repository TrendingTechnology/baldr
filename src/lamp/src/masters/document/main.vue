<template>
  <div class="vc_document_master">
    <pdf-viewer :src="asset.httpUrl" :page="navNos.stepNo"/>
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
