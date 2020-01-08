<template>
  <div
    class="vc_slide_preview"
    @click="gotToSlide(slide.no)"
  >
    <material-icon
      v-if="slide.master.icon.showOnSlides"
      :name="slide.master.icon.name"
      :color="slide.master.icon.color"
      outline="circle"
    />
    <slide-preview-renderer :slide="slide"/>
  </div>
</template>

<script>
import SlidePreviewRenderer from './SlidePreviewRenderer.vue'

export default {
  name: 'SlidePreview',
  props: {
    slide: {
      type: Object
    }
  },
  components: {
    SlidePreviewRenderer
  },
  methods: {
    gotToSlide (slideNo) {
      this.$store.dispatch('presentation/setSlideNoCurrent', slideNo)
      if (this.$route.name !== 'slides') this.$router.push({ name: 'slides' })
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_slide_preview {
    background-color: $black;
    border: 1px solid $gray;
    color: $white;
    height: 15em;
    margin: 0em;
    overflow: hidden;
    width: 20em;

    .baldr-icon {
      font-size: 2.5em;
      left: -0.3em;
      position: absolute;
      top: -0.3em;
    }
  }
</style>
