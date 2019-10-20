<template>
  <div class="vc_media_overview" b-ui-theme="default">
    <h1>Media</h1>

    <media-search/>

    <div v-if="isMedia">
      <media-table type="audio"/>
      <media-table type="video"/>
      <media-table type="image"/>
    </div>

    <p v-else>Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import MediaSearch from './MediaSearch.vue'
import MediaTable from './MediaTable.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaOverview',
  components: {
    MediaSearch, MediaTable
  },
  computed: mapGetters(['isMedia'])
}
</script>

<style lang="scss" scoped>
  .vc_media_overview {
    font-size: 1vw;
    padding: 2vw;
  }
</style>
