<template>
  <div class="vc_generic_master">
    <span ref="contentWrapper" class="content-wrapper" v-html="markupCurrent" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

const CHARACTERS_ON_SLIDE = 400

@Component
export default class GenericMasterMain extends MasterMain {
  masterName = 'generic'

  @Prop({
    type: [String, Array],
    required: true
  })
  markup!: string[]

  @Prop({
    type: Number,
    default: CHARACTERS_ON_SLIDE
  })
  charactersOnSlide!: number

  get markupCurrent (): string {
    if (this.navigationNumbers.stepNo) {
      return this.markup[this.navigationNumbers.stepNo - 1]
    }
    return this.markup[0]
  }
}
</script>

<style lang="scss">
.vc_generic_master {
  padding: 0.5em 2em;
}
</style>
