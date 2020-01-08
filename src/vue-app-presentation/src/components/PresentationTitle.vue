<template>
  <section class="vc_presentation_title">
    <header>
      <div v-if="presentation.grade">
        Jahrgangsstufe
        <span v-html="presentation.grade"/>
      </div>
      <div v-if="presentation.curriculum">
        <span v-html="presentation.curriculum"/>
      </div>
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

<style lang="scss" scoped>
  .vc_presentation_title {
    font-size: 2vw;

    header {
      display: flex;
      width: 100%;
      justify-content: space-between;
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
