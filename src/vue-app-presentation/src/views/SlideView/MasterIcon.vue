<template>
  <div
    v-if="master && master.icon.showOnSlides"
    :class="['vc_master_icon', master.icon.size]"
    b-content-theme="default"
  >
    <material-icon
      :name="master.icon.name"
      :color="master.icon.color"
    />
  </div>
</template>

<script>
export default {
  name: 'MasterIcon',
  computed: {
    master () {
      const slide = this.$store.getters['presentation/slideCurrent']
      if ('master' in this.$route.meta) {
        return this.$masters[this.$route.meta.master]
      } else if (slide) {
        return slide.master
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_master_icon {
    background: none !important;
    left: 1vw;
    position: absolute;
    top: 0.5vw;
    z-index: 2;

    &.small {
      font-size: 5vw !important;
    }
    &.large {
      font-size: 10vw !important;
    }
  }
</style>
