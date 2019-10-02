<template>
  <tr>
    <td><preview-image @click.native="play(mediaFile.uri)" :media-file="mediaFile"/></td>
    <td>
      <router-link
        title="Medien-Datei-Überblick öffnen"
        :to="{
          name: 'media-file',
          params: {
            id: mediaFile.id
          }
        }"
      >
        {{ mediaFile.titleSafe }}
      </router-link>
    </td>
    <td class="shortcut">{{ mediaFile.shortcut }}</td>
    <td>{{ dimension }}</td>
  </tr>
</template>

<script>
import { formatDuration } from '../index.js'
import PreviewImage from './PreviewImage.vue'

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
    }
  },
  methods: {
    play (uri) {
      this.$media.player.start(uri)
    }
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
      width: 6vw;
    }

    &:last-child {
      text-align: right;
      width: 10vw;
    }
  }
</style>
