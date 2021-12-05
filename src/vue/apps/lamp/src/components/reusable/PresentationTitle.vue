<template>
  <section class="vc_presentation_title" v-if="presentation">
    <titles-bread-crumbs
      v-if="presentation.parentDir"
      :rel-path="presentation.parentDir"
      :not-last="true"
    />
    <h1 v-html="presentation.title"/>
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle"/>
  </section>
</template>

<script>
import TitlesBreadCrumbs from '@/components/reusable/TitlesBreadCrumbs.vue'
import { createNamespacedHelpers } from '@bldr/vue-packages-bundler'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'PresentationTitle',
  components: {
    TitlesBreadCrumbs
  },
  computed: {
    ...mapGetters(['presentation'])
  }
}
</script>
