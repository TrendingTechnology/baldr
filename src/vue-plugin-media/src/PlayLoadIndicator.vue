<template>
  <div class="vc_play_load_indicator" b-ui-theme="default">
    <span v-if="sampleLoaded && !samplePlaying">
      L: {{ sampleLoaded.titleFormated }}
    </span>
    <span v-if="samplePlaying">
      P: {{ samplePlaying.titleFormated }}
    </span>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'PlayLoadIndicator',
  computed: mapGetters(['sampleLoaded', 'samplePlaying'])
}
</script>
