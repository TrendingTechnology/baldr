<template>
  <div class="vc_cloze_master">
    <div ref="clozeWrapper" id="cloze-wrapper" v-html="svgMarkup" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { mapStepFieldDefintions } from '@bldr/presentation-parser'

import MasterMain from '../../components/reusable/MasterMain.vue'

@Component({ props: mapStepFieldDefintions(['subset']) })
export default class ClozeMasterMain extends MasterMain {
  masterName = 'generic'

  @Prop({
    type: String,
    required: true
  })
  src: string

  data () {
    return {
      domSteps: null
    }
  }

  get svgMarkup () {
    return this.$store.getters['lamp/masters/cloze/svgByUri'](this.src)
  }
}
</script>

<style lang="scss">
.vc_cloze_master {
  padding: 0;
  background-color: white;

  svg {
    width: 100%;
    height: auto;
  }
}
</style>
