<template>
  <section class="vc_media_table" v-if="assetsByMimeType.length > 0">
    <h2>
      <material-icon
        :name="`file-${mimeType}`"
        :color="typeToColor(mimeType)"
      />
        {{ mimeType }}
    </h2>
    <table>
      <thead>
        <tr>
          <td></td>
          <td>Title</td>
          <td>Shortcut</td>
          <td></td>
          <td></td>
        </tr>
      </thead>
      <tbody>
        <table-row
          v-for="asset in assetsByMimeType"
          :key="asset.ref"
          :asset="asset"
        />
      </tbody>
    </table>
  </section>
</template>

<script>
import { mimeTypeManager } from '@bldr/client-media-models'
import TableRow from './TableRow.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaTable',
  components: {
    TableRow
  },
  props: {
    mimeType: {
      type: String
    }
  },
  computed: {
    ...mapGetters(['assets']),
    assetsByMimeType () {
      const output = []
      for (const ref in this.assets) {
        const asset = this.assets[ref]
        if (asset.mimeType === this.mimeType) {
          output.push(asset)
        }
      }
      return output
    }
  },
  methods: {
    typeToColor (type) {
      return mimeTypeManager.typeToColor(type)
    }
  }
}
</script>

<style lang="scss">
  .vc_media_table {
    table {
      width: 100%;
    }
  }
</style>
