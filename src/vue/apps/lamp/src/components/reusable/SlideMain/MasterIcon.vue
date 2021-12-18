<template>
  <span
    v-if="master && master.icon.showOnSlides"
    :class="['vc_master_icon', master.icon.size]"
    b-content-theme="default"
  >
    <color-icon :name="master.icon.name" :color="master.icon.color" />
  </span>
</template>

<script>
export default {
  name: 'MasterIcon',
  props: {
    slide: {
      type: Object,
      required: true
    }
  },
  computed: {
    master () {
      return this.slide.master
    }
  }
}
</script>

<style lang="scss">
// See styling:
// - components/reusable/SlideMain/MasterIcon.vue (Basic styling)
// - routes/SpeakerView/index.vue (Adjustments for the speaker view)
// - routes/SlideView/index.vue (Adjustments for the main slide view)
.vc_master_icon {
  background: none !important;
  position: absolute;
  z-index: 2;
}
</style>
