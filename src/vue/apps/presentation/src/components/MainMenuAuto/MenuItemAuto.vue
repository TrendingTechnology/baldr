<template>
  <li class="vc_menu_item_auto" v-if="!isDynamicRoute()">
    <router-link
       @click.native="$modal.hide('menu')"
      :to="path()"
    >
      {{ item.title }}
    </router-link>

    <ul v-if="item.children && item.children.length" class="content">
      <span
        v-for="item in item.children"
        :key="item.name"
      >
        <menu-item
          :item="item"
          :prefix="prefix + '/' + item.path"
        />
      </span>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'MenuItemAuto',
  props: {
    item: {
      type: Object
    },
    prefix: {
      type: String,
      default: ''
    }
  },
  methods: {
    path () {
      return `${this.prefix}`
    },
    isDynamicRoute () {
      if (this.item.path.indexOf(':') > 0) return true
      return false
    }
  }
}
</script>
