<template>
  <section class="vc_presentation_title" v-show="presentationNg">
    <titles-bread-crumbs
      v-if="parentDir"
      :rel-path="parentDir"
      :not-last="true"
    />
    <h1 v-if="title" v-html="title" />
    <h2 v-if="subtitle" v-html="subtitle" />
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

import { Presentation } from '@bldr/presentation-parser'

import TitlesBreadCrumbs from '@/components/reusable/TitlesBreadCrumbs.vue'

const { mapGetters } = createNamespacedHelpers('lamp')

@Component({
  components: {
    TitlesBreadCrumbs
  },
  computed: mapGetters(['presentationNg'])
})
export default class PresentationTitle extends Vue {
  presentationNg!: Presentation

  get title (): string | undefined {
    if (this.presentationNg?.meta?.title) {
      return this.presentationNg.meta.title
    }
  }

  get subtitle (): string | undefined {
    if (this.presentationNg?.meta?.subtitle) {
      return this.presentationNg.meta.subtitle
    }
  }

  get parentDir (): string | undefined {
    return this.presentationNg.parentDir
  }
}
</script>

<style lang="scss">
.vc_presentation_title {
  h1 {
    margin-top: 1em !important;
  }
}
</style>
