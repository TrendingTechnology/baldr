<template>
  <div
    class="
      vc_document_master_preview
      slide-preview-fullscreen
    "
  >
    <img v-if="asset.previewHttpUrl" :src="asset.previewHttpUrl" class="image-contain"/>
    <pdf-viewer v-else :page="pageComputed" :src="asset.httpUrl"/>
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
      if (this.page) {
        return this.page
      }
      return 1
    }
  }
}
</script>
