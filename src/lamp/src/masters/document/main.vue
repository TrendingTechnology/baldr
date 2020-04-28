<template>
  <div class="vc_document_master">
    <pdf :src="asset.httpUrl"/>
  </div>
</template>

<script>
import Pdf from 'vue-pdf'

export default {
  props: {
    asset: {
      type: Object
    }
  },
  components: {
    Pdf
  }
}
</script>

<style lang="scss">
  .vc_document_master {

  }
</style>
