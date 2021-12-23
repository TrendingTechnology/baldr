<template>
  <div class="vc_note_master biggest" v-html="markup" />
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  props: {
    markup: {
      type: String
    }
  },
  data () {
    return {
      domSteps: null
    }
  },
  computed: {
    ...mapGetters(['slide'])
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
