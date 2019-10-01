<template>
  <tr>
    <td><preview-image :media-file="mediaFile"/></td>
    <td>{{ mediaFile.titleSafe }}</td>
    <td>{{ mediaFile.shortcut }}</td>
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
  }
}
</script>

<style lang="scss" scoped>
  td {
    padding: 0.3em;
    padding-bottom: 0em;
  }

  td:first-child {
    width: 5vw;
  }

  td:last-child {
    text-align: right;
  }
</style>
