<template>
  <tr class="vc_table_row">
    <td><preview-image @click.native="play(mediaFile.uri)" :media-file="mediaFile"/></td>
    <td>
      <router-link
        title="Medien-Datei-Überblick öffnen"
        :to="{
          name: 'media-file',
          params: {
            uriScheme: mediaFile.uriScheme,
            uriAuthority: mediaFile.uriAuthority
          }
        }"
      >
        {{ mediaFile.titleSafe }}
      </router-link>
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
        @click.native="removeMediaFile(mediaFile)"
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
  props: ['mediaFile'],
  computed: {
    dimension () {
      const file = this.mediaFile
      let dimension
      if (this.mediaFile.type === 'image') {
        dimension = `${file.mediaElement.width} x ${file.mediaElement.height}`
      } else {
        dimension = formatDuration(file.mediaElement.duration)
      }
      return dimension
    },
    shortcuts () {
      if (this.mediaFile.shortcut) {
        return [{ shortcut: this.mediaFile.shortcut }]
      }
      const samples = this.mediaFile.samples
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
    ...mapActions(['removeMediaFile'])
  }
}
</script>

<style lang="scss" scoped>
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
</style>
