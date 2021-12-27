<template>
  <div class="vc_note_master biggest" v-html="markup" />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { StepController } from '@bldr/dom-manipulator'

import MasterMain from '../MasterMain.vue'

@Component
export default class NoteMasterMain extends MasterMain {
  masterName = 'note'

  @Prop({
    type: String
  })
  markup: string

  stepController: StepController

  data () {
    return {
      stepController: null
    }
  }
}
</script>

<style lang="scss">
.vc_note_master {
  // left right padding more because of ul ol etc ...
  padding: 1em 2.5em;

  table {
    table-layout: fixed;
  }

  &.biggest {
    line-height: 1.35em;
  }
}
</style>
