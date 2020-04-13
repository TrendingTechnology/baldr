<template>
  <div class="vc_common_example main-app-padding main-app-fullscreen" b-ui-theme="default">
    <h1>Allgemeines Beispiel “{{ exampleName }}”</h1>

    <section>
      <h2>Example
        <router-link :to="{ name: 'slides-preview', params: { presId: `EP_common_${exampleName}` } }">
          <material-icon name="presentation"/>
        </router-link>
      </h2>

      <pre><code>{{ rawYaml }}</code></pre>
    </section>
  </div>
</template>

<script>
/* globals rawYamlExamples */

export default {
  name: 'CommonExample',
  computed: {
    exampleName () {
      return this.$route.params.exampleName
    },
    rawYaml () {
      return rawYamlExamples.common[this.exampleName]
    }
  }
}
</script>

<style lang="scss">
  .vc_common_example {
    font-size: 1.4vw;
  }
</style>
