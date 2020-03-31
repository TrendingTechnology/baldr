<template>
  <div
    class="
      vc_media_ids_parent_dir
      main-app-padding
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <h1>Medien-IDs im übergeordneten Ordner</h1>

    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Type</th>
          <th>Dateiendung</th>
          <th>Titel</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="mediaAsset in mediaAssets" :key="mediaAsset.id">
          <td class="id">{{ mediaAsset.id }}</td>
          <td>{{ mediaAsset.assetType }}</td>
          <td>{{ mediaAsset.extension }}</td>
          <td>{{ mediaAsset.title }}</td>
        </tr>
      </tbody>
    </table>

    <h2>Nur die IDs</h2>

    <code>
      <div v-for="mediaAsset in mediaAssets" :key="mediaAsset.id">
        {{ mediaAsset.id }}
      </div>
    </code>

  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'MediaIdsParentDir',
  data () {
    return {
      mediaAssets: null
    }
  },
  computed: mapGetters(['presentation']),
  mounted () {
    if (this.presentation) {
      this.$media.httpRequest.request({
        url: 'query',
        method: 'get',
        params: {
          type: 'assets',
          method: 'substringSearch',
          field: 'path',
          search: this.presentation.parentDir,
          result: 'fullObjects'
        }
      }).then((response) => {
        this.mediaAssets = response.data
      })
    }
  }
}
</script>

<style lang="scss">
  .vc_media_ids_parent_dir {
    font-size: 1vw !important;

    .id {
      font-family: $font-family-mono;
    }
  }
</style>
