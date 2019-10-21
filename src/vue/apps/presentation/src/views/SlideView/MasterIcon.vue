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
      if ('master' in this.$route.meta) {
        return this.$masters[this.$route.meta.master]
      } else if (this.$store.getters.slideCurrent) {
        return this.$store.getters.slideCurrent.master
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
    top: 2vw;
    left: 2vw;
    background: none !important;
    opacity: 0.8;
  }
</style>
