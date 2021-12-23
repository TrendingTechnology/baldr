<template>
  <div class="vc_open_interface">
    <div class="flex-container">
      <search-presentation />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SearchPresentation from './SearchPresentation.vue'

@Component({
  components: {
    SearchPresentation
  }
})
export default class OpenInterface extends Vue {}
</script>

<style lang="scss">
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
