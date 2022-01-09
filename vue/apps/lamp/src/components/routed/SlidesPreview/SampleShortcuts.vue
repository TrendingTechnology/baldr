<template>
  <div class="vc_sample_shortcuts">
    <sample-shortcuts-by-mime-type mime-type="audio" />
    <sample-shortcuts-by-mime-type mime-type="video" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import SampleShortcutsByMimeType from './SampleShortcutsByMimeType.vue'

@Component({
  components: {
    SampleShortcutsByMimeType
  }
})
export default class SampleShortcuts extends Vue {}
</script>

<style lang="scss">
.vc_sample_shortcuts {
  display: flex;
  justify-content: center;
}
</style>
