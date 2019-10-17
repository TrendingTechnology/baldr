<template>
  <div class="home">
    <open-interface/>
  </div>
</template>

<script>
import OpenInterface from '@/components/OpenInterface'
export default {
  name: 'Home',
  components: {
    OpenInterface
  },
  mounted: function () {
    this.$styleConfig.set()
  }
}
</script>

<style lang="scss" scoped>
  .home {
    font-size: 2vw;
  }
</style>
