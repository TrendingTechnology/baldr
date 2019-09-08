<template>
  <div class="media-overview">
    <h1>Media</h1>
    <ul v-if="isMedia">
      <li v-for="mediaFile in media" :key="mediaFile.URI">
        <material-icon :name="`file-${mediaFile.type}`"/>
        <img v-if="mediaFile.httpURL" :src="mediaFile.httpURL"/>
        {{ mediaFile.filename }}
      </li>
    </ul>

    <p v-if="!isMedia">Keine Medien-Dateien geladen.</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'MediaOverview',
  computed: mapGetters(['media', 'isMedia']),
  mounted () {
    this.$styleConfig.set({
      overflow: false,
      darkMode: false,
      centerVertically: false
    })
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
