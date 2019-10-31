<template>
  <div v-if="master" class="vc_master_icon" b-content-theme="default">
    <material-icon
      :name="master.icon"
      :color="master.color"
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
    z-index: 2;
    font-size: 5vw !important;
    position: absolute;
    top: 0.5vw;
    left: 1vw;
    background: none !important;
  }
</style>
