<template>
  <div class="metadata">
    <h1></h1>
    <h2></h2>
    <div class="people">
      <div class="lyricist"></div>
      <div class="composer"></div>
    </div>
    <div class="links">
      <a style="display: none;" class="icon musescore" title="Musescore" href=""></a>
      <a style="display: none;" class="icon youtube" title="Youtube" href=""></a>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  .metadata {
    padding-top: 0.2vw;
    position: absolute;
    width: 100%;
  }

  .people {
    display: flex;
    font-size: 2vh;
    padding: 5vw;
  }

  .people > div {
    flex: 1;
  }

  .composer {
    text-align: right;
  }

  .links {
    position: absolute;
    left: 5vw;
    top: 1vh;
  }

  .links > div {
    flex: 1;
  }

  .lyricist {
    text-align: left;
  }

  h1, h2 {
    font-family: 'Alegreya Sans' !important;
    margin: 1vh;
  }

  h1 {
    font-size: 5vh;
  }

  h2 {
    font-size: 3vh;
    font-style: italic;
  }

  .musescore {
    background: url('icons/musescore.svg') left center no-repeat;
  }

  .youtube {
    background: url('icons/youtube.svg') left center no-repeat;
  }
</style>
