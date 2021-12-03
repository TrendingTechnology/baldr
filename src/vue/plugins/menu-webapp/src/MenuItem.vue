<template>
  <div class="bar-menu-item"
    @mousedown="(e) => e.preventDefault()"
    @click="(e) => item.click ? item.click(e) : e.stopPropagation()"
    :class="{ disabled: item.disabled, active: item.active }"
    :title="item.title"
    :style="{ height: item.height+'px' }">

    <span v-if="item.icon" class="baldr-icon baldr-icon_chevron-right"></span>
    <span v-if="item.label" class="label">{{ item.label }}</span>
    <span v-if="item.html" class="label" v-html="item.html"></span>
    <span v-if="item.keyboardShortcut" class="hotkey">{{ item.keyboardShortcut }}</span>

    <span v-if="item.submenu" class="baldr-icon baldr-icon_chevron-right"></span>

    <component class="menu" v-if="item.submenu"
      :is="getComponent(item.submenu)"
      :submenu="item.submenu"
      :class="item.menu_class"
      :width="item.menu_width"
      :height="item.menu_height" />

  </div>
</template>

<script>
export default {
  components: {
    BarMenu: () => import('./BarMenu.vue') // recursive component
  },
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    getComponent (is) {
      if(is && !Array.isArray(is) && typeof is == "object") return is;
      else return "bar-menu";
    }
  }
}
</script>
