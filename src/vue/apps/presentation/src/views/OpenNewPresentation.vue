<template>
  <div>
    <input type="file" @change="openPresentation"/>
  </div>
</template>

<script>
import { openFiles } from '@/content-file.js'

export default {
  name: 'OpenNewPresentation',
  methods: {
    openPresentation (event) {
      openFiles(event.target.files)
    }
  }
}
</script>
