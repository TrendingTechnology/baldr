<template>
  <div class="main-menu">
    <menu-item
      v-for="item in $router.options.routes"
      :key="item.name"
      :item="item"
      :prefix="item.path"
    />
  </div>
</template>

<script>
import MenuItem from './MenuItem'
export default {
  name: 'MainMenu',
  components: {
    MenuItem
  }
}
</script>

<style lang="scss" scoped>

</style>
