<template>
  <ul class="main-menu content">
    <menu-item
      v-for="item in $router.options.routes"
      :key="item.name"
      :item="item"
      :prefix="item.path"
    />
  </ul>
</template>

<script>
import MenuItemAuto from './MenuItemAuto.vue'
export default {
  name: 'MainMenuAuto',
  components: {
    MenuItemAuto
  }
}
</script>
