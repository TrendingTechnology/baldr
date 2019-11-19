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
      <div v-if="mediaFile.samples">
        <div v-if="Object.keys(mediaFile.samples).length === 1">
          <div v-for="sample in mediaFile.samples" :key="sample.id">
            {{ sample.shortcut }}
          </div>
        </div>
        <div v-if="Object.keys(mediaFile.samples).length > 1">
          <div v-for="sample in mediaFile.samples" :key="sample.id">
            {{ sample.shortcut }} <span class="sample-title">({{ sample.title }})</span>
          </div>
        </div>
      </div>
    </td>
    <td>{{ dimension }}</td>
  </tr>
</template>

<script>
import { formatDuration } from '../main.js'
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
      this.$media.player.load(uri)
      this.$media.player.play()
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
      width: 12vw;
    }

    &:last-child {
      text-align: right;
      width: 10vw;
    }

    .sample-title {
      font-size: 0.7em;
    }
  }
</style>
