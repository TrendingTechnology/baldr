<template>
  <div
    class="vc_note_master"
    v-html="markup"
  />
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    markup: {
      type: String
    },
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide']),
  }
}
</script>

<style lang="scss">
  .vc_note_master {
    // left right padding more because of ul ol etc ...
    padding: 2vw 5vw;

    table {
      table-layout: fixed;
    }
  }
</style>
