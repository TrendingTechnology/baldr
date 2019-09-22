<template>
  <div class="media-overview">
    <h1>Media</h1>
    <ul v-if="isMedia">
      <li v-for="mediaFile in mediaFiles" :key="mediaFile.uri" @click="play(mediaFile.uri)">
        <material-icon :name="`file-${mediaFile.type}`" />
        <img v-if="mediaFile.httpUrl && mediaFile.type === 'image'" :src="mediaFile.httpUrl" />
        {{ mediaFile.filename }}
      </li>
    </ul>

    <p v-if="!isMedia">Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('media')

export default {
  name: 'MediaOverview',
  computed: mapGetters(['mediaFiles', 'isMedia']),
  methods: {
    play (uri) {
      this.$media.player.start(uri)
    }
  }
}
</script>

<style lang="scss" scoped>
.media-overview {
  font-size: 1.8vw;
  img {
    width: 5vw;
    height: 5vw;
    object-fit: contain;
    background-color: $black;
    padding: 0.3vw;
  }
}
</style>
