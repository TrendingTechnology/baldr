<template>
  <section class="vc_presentation_title" v-if="presentation">
    <header>
      <span v-if="presentation.grade">
        <span v-html="presentation.grade"/>. Jahrgangsstufe /
      </span>
      <span v-if="presentation.curriculum" v-html="presentation.curriculum"/>
    </header>

    <h1 v-html="presentation.title"/>
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle"/>
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

<style lang="scss">
  .vc_presentation_title {
    font-size: 2vw;

    header {
      width: 100%;
      font-size: 0.7em;
      text-align: center;
    }

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
