<template>
  <div class="vc_counter_master sans">
    <div class="counter-current">
      {{ current }}
    </div>
    <div class="counter-to">
      / {{ to }}
    </div>
    </div>
</template>

<script>
export default {
  props: {
    to: {
      type: Number,
      required: true
    }
  },
  computed: {
    current () {
      if (this.navNos.stepNo != null) {
        return this.navNos.stepNo
      }
      return 1
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
