<template>
  <ul class="vc_main_menu">
    <menu-item :to="{ name: 'home' }"/>
    <menu-item :to="{ name: 'open' }"/>
    <menu-item :to="{ name: 'slides' }"/>
    <menu-item :to="{ name: 'slides-overview' }"/>

    <li>Ad-Hoc-Folien
      <ul>
        <menu-item :to="{ name: 'camera' }"/>
        <menu-item :to="{ name: 'editor' }"/>
      </ul>
    </li>

    <menu-item :to="{ name: 'documentation' }">
      <ul>
        <menu-item
          v-for="(master, masterName) in $masters"
          :key="masterName"
          :to="`/documentation/${masterName}`"
          :text="masterName"
        />
      </ul>
    </menu-item>
    <li>Administration
      <ul>
        <menu-item :to="{ name: 'rest-api' }"/>
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
