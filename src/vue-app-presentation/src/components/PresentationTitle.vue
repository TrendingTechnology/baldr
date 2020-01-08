<template>
  <section class="vc_presentation_title">
    <h1 v-html="presentation.title"/>
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle"/>
    <p v-if="presentation.grade">
      <strong>Jahrgangsstufe: </strong>
      <span v-html="presentation.grade"/>
    </p>
    <p v-if="presentation.curriculum">
      <strong>Lehrplanbezug: </strong>
      <span v-html="presentation.curriculum"/>
    </p>
  </section>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  name: 'PresentationTitle',
  computed: mapGetters([
    'presentation'
  ])
}
</script>

<style lang="scss" scoped>
  .vc_presentation_title {
    font-size: 2vw;

    h1, h2 {
      text-align: center;
      margin-bottom: 0;
    }

    h1 {
      font-size: 1.6em;
    }

    h2 {
      font-weight: normal;
      margin-top: 0;
      font-size: 1.4em;
    }
  }
</style>
