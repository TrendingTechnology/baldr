<template>
  <div class="vc_common_example main-app-padding" b-ui-theme="default">
    <h1>Allgemeines Beispiel “{{ exampleName }}”</h1>

    <section>
      <h2>Example <material-icon name="presentation" @click.native="openExample"/></h2>

      <pre><code>{{ rawYaml }}</code></pre>
    </section>
  </div>
</template>

<script>
import {  markupToHtml, openPresentationByRawYaml } from '@/lib.js'

export default {
  name: 'CommonExample',
  computed: {
    exampleName () {
      return this.$route.params.exampleName
    },
    rawYaml () {
      return rawYamlExamples.common[this.exampleName]
    }
  },
  methods: {
    openExample () {
      openPresentationByRawYaml(this.rawYaml)
    }
  }
}
</script>

<style lang="scss">
  .vc_common_example {
    font-size: 1.4vw;
  }
</style>
