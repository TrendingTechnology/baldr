<template>
  <div
    class="vc_wave_form"
    v-if="asset.waveformHttpUrl"
  >
    <img
      ref="waveformImg"
      :src="asset.waveformHttpUrl"
    />
    <div
      ref="progressIndicatorOverlayDiv"
      class="progress-indicator-overlay"
    />
  </div>
</template>

<script>
export default {
  name: 'WaveForm',
  props: {
    sample: {
      type: Object
    }
  },
  computed: {
    asset () {
      return this.sample.asset
    }
  },
  methods: {
    registerEvents() {
      this.sample.htmlElement.addEventListener('timeupdate', (event) => {
        if (this.$refs.progressIndicatorOverlayDiv == null) {
          return
        }
        const div = this.$refs.progressIndicatorOverlayDiv
        const audio = this.sample.htmlElement

        const img = this.$refs.waveformImg
        const height = img.clientHeight
        const width = img.clientWidth

        div.style.height = `${height}px`
        div.style.width = `${audio.currentTime / audio.duration * width}px`
        div.style.marginLeft = `${img.offsetLeft}px`
        div.style.marginTop = `${img.offsetTop}px`
      })
    }
  },
  watch: {
    sample () {
      this.registerEvents()
    }
  },
  mounted () {
    this.registerEvents()
  }
}
</script>

<style lang="scss">
  .vc_wave_form {
    position: relative;
    padding: 1em;

    img {
      filter: invert(100%);
      opacity: 0.4;
      height: 10vw;
      width: 60vw;
      position: relative;
    }

    .progress-indicator-overlay {
      background-color: $blue;
      height: 0;
      left: 0;
      opacity: 0.2;
      position: absolute;
      top: 0;
      width: 0;
    }
  }
</style>
