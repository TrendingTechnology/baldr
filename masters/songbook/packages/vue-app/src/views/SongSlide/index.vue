<template>
  <section>
    <img>

    <div class="slide-number"></div>
  </section>
</template>

<script>
export default {
  name: 'SongSlide',
  created: function () {
    let songID = this.$route.params.songid
    this.$store.commit('setSongCurrent', songID)
  }
}
</script>

<style>
  section {
    max-width: 100%;
    max-height: 100%;
    text-align: center;
  }

  img {
    width: 100%;
    height: 100%;
    vertical-align: middle;
    background-color: white;
  }

  .slide-number {
    padding: 1vw;
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 1;
    font-size: 1vw;
    opacity: 0;
  }

  .fade-out {
    animation: fadeout 2s linear forwards;
  }

  @keyframes fadeout {
    0% { opacity: 1; }
    100% { opacity: 0; }
  }

  .icon {
    height: 3vw;
    width: 3vw;
    display: inline-block;
    opacity: 0.1;
  }

  .icon:hover {
    opacity: 1;
  }

</style>
