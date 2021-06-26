<template>
  <tr class="vc_table_row">
    <td><preview-image @click.native="play(asset.ref)" :asset="asset"/></td>
    <td>
      <router-link
        title="Medien-Datei-Überblick öffnen"
        :to="{
          name: 'asset',
          params: {
            uriScheme: 'ref',
            uriAuthority: asset.yaml.ref
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
import { formatDuration } from '@bldr/core-browser'
import PreviewImage from './PreviewImage.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapActions } = createNamespacedHelpers('media')

export default {
  name: 'TableRow',
  components: {
    PreviewImage
  },
  props: {
    asset: {
      type: Object
    }
  },
  computed: {
    dimension () {
      let dimension = ''
      if (this.asset.mimeType === 'image' && this.asset.htmlElement.width !== 0 && this.asset.htmlElement.height !== 0) {
        dimension = `${this.asset.htmlElement.width} x ${this.asset.htmlElement.height}`
      } else if (this.asset.isPlayable) {
        dimension = formatDuration(this.asset.htmlElement.duration)
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

      // dimension
      &:nth-child(4) {
        width: 10vw;
      }

      &:last-child {
        text-align: right;
        width: 1vw;
      }

      .shortcut-title {
        font-size: 0.7em;
      }
    }
  }
</style>
