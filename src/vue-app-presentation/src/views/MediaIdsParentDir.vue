<template>
  <div class="vc_media_ids_parent_dir default-padding" b-content-theme="default">
    <h1>Medien-IDs im übergeordneten Ordner</h1>

    <div v-for="mediaAsset in mediaAssets" :key="mediaAsset.id">

      {{ mediaAsset.id }}
    </div>

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
    console.log(this.presentation)
    this.$media.httpRequest.request({
      url: 'query',
      method: 'get',
      params: {
        type: 'assets',
        method: 'substringSearch',
        field: 'path',
        search: 'Ausstellung',
        result: 'fullObjects'
      }
    }).then((response) => {
      console.log(response.data)
      this.mediaAssets = response.data
    })
  }
}
</script>
