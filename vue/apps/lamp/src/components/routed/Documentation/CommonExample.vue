<template>
  <div
    class="vc_common_example main-app-padding main-app-fullscreen"
    b-ui-theme="default"
  >
    <h1>Allgemeines Beispiel „{{ exampleName }}“</h1>

    <presentation-example
      class="vc_master_presentation_example"
      :pres-ref="exampleRef"
      :yaml-markup="rawYaml"
    />
  </div>
</template>

<script lang="ts">
/* global rawYamlExamples */

import Vue from 'vue'
import Component from 'vue-class-component'
import PresentationExample from './PresentationExample.vue'

@Component({
  components: {
    PresentationExample
  }
})
export default class CommonExample extends Vue {
  get exampleName (): string {
    return this.$route.params.exampleName
  }

  get exampleRef (): string {
    return `EP_common_${this.exampleName}`
  }

  get rawYaml (): string {
    return rawYamlExamples.common[this.exampleName]
  }
}
</script>

<style lang="scss">
.vc_common_example {
  font-size: 1.4vw;
}
</style>
