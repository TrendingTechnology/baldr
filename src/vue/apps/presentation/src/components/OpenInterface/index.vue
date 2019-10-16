<template>
  <div>
    <search-presentation/>
    <open-files/>
  </div>
</template>

<script>
import OpenFiles from './OpenFiles.vue'
import SearchPresentation from './SearchPresentation.vue'

export default {
  name: 'OpenInterface',
  components: {
    OpenFiles,
    SearchPresentation
  }
}
</script>
