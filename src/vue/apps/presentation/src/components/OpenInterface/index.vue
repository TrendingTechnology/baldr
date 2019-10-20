<template>
  <div class="vc_open_interface">
    <div class="flex-container">
      <search-presentation/>
      <open-files/>
    </div>
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

    .flex-container {
      display: flex;
    }

    .vc_dynamic_select {
      flex-grow: 1;
    }
  }
</style>