<template>
  <ul class="main-menu content">
    <li>Ad-Hoc-Folien
      <ul>
        <menu-item :to="{ name: 'camera' }"/>
        <menu-item :to="{ name: 'editor' }"/>
      </ul>
    </li>
  </ul>
</template>

<script>
import MenuItem from './MenuItem.vue'
export default {
  name: 'MainMenu',
  components: {
    MenuItem
  }
}
</script>
