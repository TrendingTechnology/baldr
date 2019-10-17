<template>
  <label class="open-files">
    <material-icon title="Präsentation oder Mediendateien öffnen" name="folder-open"/>
    <input type="file" @change="openPresentation"/>
  </label>
</template>

<script>
import { openFiles } from '@/content-file.js'

export default {
  name: 'OpenFiles',
  methods: {
    openPresentation (event) {
      openFiles(event.target.files)
    }
  }
}
</script>

<style lang="scss" scoped>
  .open-files {
    input {
      display: none;
    }
  }
</style>