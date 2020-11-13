<template>
  <tr class="vc_table_row">
    <td><preview-image @click.native="play(asset.uri)" :asset="asset"/></td>
    <td>
      <router-link
        title="Medien-Datei-Überblick öffnen"
        :to="{
          name: 'asset',
          params: {
            uriScheme: asset.uriScheme,
            uriAuthority: asset.uriAuthority
          }
        }"
        v-html="asset.titleSafe"
      />
    </td>
    <td class="shortcut">
      <div v-for="shortcut in shortcuts" :key="shortcut.shortcut">
        {{ shortcut.shortcut }}
        <span v-if="shortcut.title" class="shortcut-title">
          ({{ shortcut.title }})
        </span>
      </div>
    </td>
    <td>{{ dimension }}</td>
    <td>
      <material-icon
        name="close"
        @click.native="removeAsset(asset)"
      />
    </td>
  </tr>
</template>

<script>
import { formatDuration } from '../main.js'
import PreviewImage from './PreviewImage.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('media')

export default {
  name: 'TableRow',
  components: {
    PreviewImage
  },
  props: ['asset'],
  computed: {
    dimension () {
      const file = this.asset
      let dimension
      if (this.asset.type === 'image') {
        dimension = `${file.mediaElement.width} x ${file.mediaElement.height}`
      } else {
        dimension = formatDuration(file.mediaElement.duration)
      }
      return dimension
    },
    shortcuts () {
      if (this.asset.shortcut) {
        return [{ shortcut: this.asset.shortcut }]
      }
      const samples = this.asset.samples
      if (!samples) return []
      if (Object.keys(samples).length === 1) {
        return [{ shortcut: Object.values(samples)[0].shortcut }]
      }
      return samples
    }
  },
  methods: {
    play (uri) {
      this.$media.player.load(uri)
      this.$media.player.start()
    },
    ...mapActions(['removeAsset'])
  }
}
</script>

<style lang="scss">
  .vc_table_row {
    td {
      padding: 0.3em;
      padding-bottom: 0em;

      &:first-child {
        width: 5vw;
      }

      &.shortcut {
        width: 12vw;
      }

      &:last-child {
        text-align: right;
        width: 10vw;
      }

      .shortcut-title {
        font-size: 0.7em;
      }
    }
  }
</style>
