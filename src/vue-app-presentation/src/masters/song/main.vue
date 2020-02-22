<template>
  <div class="vc_song_master">
    <img :src="imageHttpUrl"/>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

export default {
  props: {
    imageHttpUrl: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_song_master {
    padding: 4vh 4vw;
    background-color: white;

    img {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
    }
  }
</style>
