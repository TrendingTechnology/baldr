<template>
  <label class="vc_open_files">
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
  .vc_open_files {
    font-size: 4vw;
    width: 5vw;
    padding-left: 1vw;

    input {
      display: none;
    }
  }
</style>