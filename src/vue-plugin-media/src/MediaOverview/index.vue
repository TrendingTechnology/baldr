<template>
  <div class="vc_media_overview" b-ui-theme="default">

    <div class="link clear" @click="clear">aufräumen</div>
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
const { mapGetters, mapActions } = createNamespacedHelpers('media')

export default {
  name: 'MediaOverview',
  components: {
    MediaSearch, MediaTable
  },
  computed: mapGetters(['isMedia']),
  methods: mapActions(['clear'])
}
</script>

<style lang="scss" scoped>
  .vc_media_overview {
    box-sizing: border-box;
    font-size: 1.8vw;
    height: 100vh;
    padding: 2vw;

    .clear {
      position: absolute;
      top: 2vw;
      right: 2vw;
    }
  }
</style>
