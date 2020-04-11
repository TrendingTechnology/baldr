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
  .vc_master_icon {
    background: none !important;
    left: 0.2em;
    position: absolute;
    top: 0.1em;
    z-index: 2;

    &.small {
      font-size: 4em !important;
    }
    &.large {
      font-size: 8em !important;
    }
  }
</style>
