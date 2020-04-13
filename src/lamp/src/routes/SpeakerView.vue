<template>
  <div class="vc_remote_control" b-ui-theme="default">
    <h1>Referentenansicht</h1>

    <div class="slide-panel">
      <slide-main :slide="slide"/>
      <slide-main :slide="slide"/>
    </div>
  </div>
</template>

<script>
import SlideMain from '@/components/SlideMain/index.vue'
import { createNamespacedHelpers } from 'vuex'
import { routerGuards } from '@/lib.js'

const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'SpeakerView',
  components: {
    SlideMain
  },
  computed: {
    ...mapGetters(['slide'])
  },
  methods: {
    sendMessage () {
      this.$socket.sendObj({ presId: 'Futurismus' })
    }
  },
  ...routerGuards
}
</script>

<style lang="scss">
  .vc_remote_control {
    .slide-panel {
      display: flex;
      font-size: 0.2vw;
    }
  }
</style>
