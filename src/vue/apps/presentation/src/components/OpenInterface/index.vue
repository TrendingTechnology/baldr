<template>
  <div class="open-interface">
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
  .open-interface {
    display: flex;

    .dynamic-select {
      flex-grow: 1;
    }

    .open-files {
      font-size: 4vw;
      width: 5vw;
      padding-left: 1vw;
    }
  }
</style>