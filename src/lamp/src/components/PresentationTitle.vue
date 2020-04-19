<template>
  <section class="vc_presentation_title" v-if="presentation">
    <topic-bread-crumb
      v-if="presentation.parentDir"
      :path="presentation.parentDir"
      :not-last="true"
    />
    <h1 v-html="presentation.title"/>
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle"/>
  </section>
</template>

<script>
import TopicBreadCrumb from './TopicBreadCrumbs.vue'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'PresentationTitle',
  components: {
    TopicBreadCrumb
  },
  computed: {
    ...mapGetters(['presentation'])
  }
}
</script>
