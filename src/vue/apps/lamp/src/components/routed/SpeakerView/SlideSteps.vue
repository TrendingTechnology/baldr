<template>
  <div class="vc_slide_steps" v-if="steps">
    <span v-for="step in steps" :key="step.no">
      <router-link
        :to="{
          name: 'speaker-view-step-no',
          params: { slideNo: slide.no, stepNo: step.no },
          query: { full: true }
        }"
        v-html="step.title"
      />
      -
    </span>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'

const { mapGetters } = createNamespacedHelpers('lamp')

@Component({ computed: mapGetters(['slide']) })
export default class SlideSteps extends Vue {
  slide: any

  get steps () {
    return this.slide.steps
  }
}
</script>

<style lang="scss" scoped>
.vc_slide_steps {
  font-size: 3em;
}
</style>
