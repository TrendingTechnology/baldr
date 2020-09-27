<template>
  <div class="bar-menu">
    <div class="extended-hover-zone"></div>
    <div class="bar-menu-items" :style="{
        width: width + 'px',
        minWidth: width + 'px',
        maxHeight: height + 'px',
        overflow: height ? 'auto' : 'visible'
      }">
      <component v-for="(item, index) in submenu"
      :is="getComponent(item.is)"
      :item="item"
      :class="item.class"
      :key="'menu-' + index" />
    </div>
  </div>
</template>

<script>
import MenuItem from './MenuItem.vue'
import MenuSeparator from './MenuSeparator.vue'

export default {
  components: {
    MenuItem,
    MenuSeparator
  },
  props: {
    submenu: {
      type: Array,
      required: true
    },
    width: Number,
    height: Number
  },
  methods: {
    getComponent(is) {
      if(typeof is == "object") return is;
      else if(typeof is == "string") return 'menu-' + is;
      else return 'menu-item';
    }
  }
}
</script>
