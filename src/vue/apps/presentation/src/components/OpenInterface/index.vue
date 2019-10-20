<template>
  <div class="vc_open_interface">
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

<style lang="scss" scoped>
  .vc_open_interface {
    font-size: 2vw;
    display: flex;

    .dynamic-select {
      flex-grow: 1;
    }
  }
</style>