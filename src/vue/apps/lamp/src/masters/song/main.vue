<template>
  <div class="vc_song_master">
    <h1 v-if="navigationNumbers.stepNo === 1">{{ image.yaml.title }}</h1>
    <img :src="image.getMultiPartHttpUrlByNo(navigationNumbers.stepNo)" />
  </div>
</template>

<script>
export default {
  props: {
    image: {
      type: Object
    }
  }
}
</script>

<style lang="scss">
.vc_song_master {
  padding: 3em 3em;
  background-color: white;
  text-align: center;

  img {
    bottom: 0;
    left: 0;
    object-fit: contain;
    width: 92%;
    height: 90%;
  }

  h1 {
    box-sizing: border-box;
    width: 100%;
    position: absolute;
    top: 1em;
    left: 0;
    text-align: center;
  }
}
</style>
