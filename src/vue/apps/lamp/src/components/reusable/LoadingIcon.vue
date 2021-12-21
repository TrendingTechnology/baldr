<template>
  <div class="vc_loading_icon valign-wrapper main-app-fullscreen">
    <div class="valign-center">
      <div class="spinner">
        <div class="rect rect-1" />
        <div class="rect rect-2" />
        <div class="rect rect-3" />
        <div class="rect rect-4" />
        <div class="rect rect-5" />
      </div>
    </div>
  </div>
</template>

<script>
// https://github.com/nguyenvanduocit/vue-loading-spinner/blob/master/src/components/Stretch.vue
export default {
  name: 'LoadingIcon'
}
</script>

<style lang="scss">
.vc_loading_icon {
  font-size: 6vmin;
  text-align: center;
  position: absolute;
  top: 0;
  left: 0;

  .spinner {
    display: inline-block;
    text-align: center;
    width: 1em;
    height: 1em;
    font-size: 1em;
    * {
      line-height: 0;
      box-sizing: border-box;
    }
  }

  .rect {
    margin-left: 0.1em;
    background-color: $gray;
    animation-duration: 1.2s;
    animation: sk-stretchdelay 1.2s ease-in-out infinite;
  }

  .spinner > div {
    height: 100%;
    width: 10%;
    display: inline-block;
  }

  .spinner .rect-2 {
    animation-delay: -1.1s;
  }

  .spinner .rect-3 {
    animation-delay: -1s;
  }

  .spinner .rect-4 {
    animation-delay: -0.9s;
  }

  .spinner .rect-5 {
    animation-delay: -0.8s;
  }

  @keyframes sk-stretchdelay {
    0%,
    40%,
    100% {
      transform: scaleY(0.4);
    }
    20% {
      transform: scaleY(1);
    }
  }
}
</style>
