<template>
  <div class="media-overview">
    <h1>Media</h1>

    <media-search/>

    <div v-if="isMedia">

      <section v-if="typeCount('audio')">
        <h2><material-icon name="file-audio" color="yellow"/>audio</h2>
        <table>
          <tbody>
            <table-row v-for="mediaFile in mediaFilesByType('audio')" :key="mediaFile.uri" :media-file="mediaFile"/>
          </tbody>
        </table>
      </section>

      <section v-if="typeCount('video')">
        <h2><material-icon name="file-video" color="red"/>video</h2>
        <table>
          <tbody>
            <table-row v-for="mediaFile in mediaFilesByType('video')" :key="mediaFile.uri" :media-file="mediaFile"/>
          </tbody>
        </table>
      </section>

      <section v-if="typeCount('image')">
        <h2><material-icon name="file-image" color="green"/>image</h2>
        <table>
          <tbody>
            <table-row v-for="mediaFile in mediaFilesByType('image')" :key="mediaFile.uri" :media-file="mediaFile"/>
          </tbody>
        </table>
      </section>
    </div>

    <p v-else>Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import MediaSearch from './MediaSearch.vue'
import TableRow from './TableRow.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaOverview',
  components: {
    MediaSearch, TableRow
  },
  computed: mapGetters(['mediaFilesByType', 'isMedia', 'typeCount']),
  methods: {
    play (uri) {
      this.$media.player.start(uri)
    }
  }
}
</script>

<style lang="scss" scoped>
  .media-overview {
    font-size: 1.8vw;

    .clickable {
      cursor: pointer;
    }

    .clickable:hover {
      background-color: scale-color($gray, $lightness: 30%);
    }

    table {
      width: 100%;
    }
  }
</style>
