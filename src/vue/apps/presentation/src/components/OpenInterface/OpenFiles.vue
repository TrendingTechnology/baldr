<template>
  <label>
    Präsentation oder Mediendateien öffnen
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
