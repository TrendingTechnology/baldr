<template>
  <div class="vc_counter_master sans">
    <div class="counter-current">
      {{ currentFormatted }}
    </div>
    <div class="counter-to">/ {{ toFormatted }}</div>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { formatCounterNumber, Format } from './main'
import MasterMain from '../MasterMain.vue'

@Component
export default class CounterMasterMain extends MasterMain {
  masterName = 'counter'

  @Prop({
    type: Number,
    required: true
  })
  to: number

  @Prop({
    type: String
  })
  toFormatted: string

  @Prop({
    type: String
  })
  format: Format

  get currentFormatted () {
    let currentNumber: number
    if (this.navigationNumbers.stepNo != null) {
      currentNumber = this.navigationNumbers.stepNo
    } else {
      currentNumber = 1
    }
    return formatCounterNumber(currentNumber, this.format)
  }
}
</script>

<style lang="scss">
.vc_counter_master {
  text-align: center;

  .counter-current {
    font-size: 2000%;
    font-weight: bold;
  }

  .counter-to {
    position: absolute;
    right: 10%;
    bottom: 10%;
  }
}
</style>
