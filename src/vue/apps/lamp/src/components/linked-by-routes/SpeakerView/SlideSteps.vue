<template>
  <div class="vc_slide_steps" v-if="steps">
    <span v-for="step in steps" :key="step.no">
      <router-link :to="{ name: 'speaker-view-step-no', params: { slideNo: slide.no, stepNo: step.no }, query: { full: true } }" v-html="step.title"/> -
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from '@bldr/vue-packages-bundler'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SlideSteps',
  computed: {
    ...mapGetters(['slide']),
    steps () {
      return this.slide.steps
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slide_steps {
    font-size: 3em;
  }
</style>
