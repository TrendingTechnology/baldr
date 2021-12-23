<template>
  <section class="vc_presentation_title" v-if="presentation">
    <titles-bread-crumbs
      v-if="presentation.parentDir"
      :rel-path="presentation.parentDir"
      :not-last="true"
    />
    <h1 v-html="presentation.title" />
    <h2 v-if="presentation.subtitle" v-html="presentation.subtitle" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

import TitlesBreadCrumbs from '@/components/reusable/TitlesBreadCrumbs.vue'


const { mapGetters } = createNamespacedHelpers('lamp')

@Component({
  components: {
    TitlesBreadCrumbs
  },
  computed: {
    ...mapGetters(['presentation'])
  }
})
export default class PresentationTitle extends Vue {}
</script>
