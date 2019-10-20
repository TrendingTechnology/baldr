<template>
  <div class="vc_start_page default-padding" b-ui-theme="default">
    <open-interface/>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'
export default {
  name: 'StartPage',
  components: {
    OpenInterface
  },
  mounted: function () {
    this.$styleConfig.set()
  }
}
</script>

<style lang="scss" scoped>
  .vc_start_page {
    font-size: 2vw;
    display: table;
    height: 100vh;
    width: 100vw;

    .vc_open_interface {
      display: table-cell;
      vertical-align: middle;
    }
  }
</style>
