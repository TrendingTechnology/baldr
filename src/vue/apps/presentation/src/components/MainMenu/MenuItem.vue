<template>
  <li class="menu-item">
    <router-link
       @click.native="$modal.hide('menu')"
      :to="path()"
    >
      {{ item.name }}
    </router-link>

    <ul v-if="item.children && item.children.length">
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
  name: 'MenuItem',
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
    }
  }
}
</script>
