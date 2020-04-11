<template>
  <div class="vc_song_master">
    <h1 v-if="stepNo === 1">{{ image.titleCombined }}</h1>
    <img :src="image.getMultiPartHttpUrlByNo(stepNo)"/>
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
    padding: 4vh 4vw;
    background-color: white;

    img {
      bottom: 0;
      left: 0;
      object-fit: contain;
      width: 92vw;
      height: 90vh;
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
