<template>
  <div class="vc_counter_master sans">
    <div class="counter-current">
      {{ currentFormatted }}
    </div>
    <div class="counter-to">
      / {{ toFormatted }}
    </div>
    </div>
</template>

<script>
import { formatCounterNumber } from './main'

export default {
  props: {
    to: {
      type: Number,
      required: true
    },
    toFormatted: {
      type: String
    },
    format: {
      type: String,
    }
  },
  computed: {
    currentFormatted () {
      let currentNumber
      if (this.navNos.stepNo != null) {
        currentNumber = this.navNos.stepNo
      } else {
        currentNumber = 1
      }
      return formatCounterNumber(currentNumber, this.format)
    }
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
