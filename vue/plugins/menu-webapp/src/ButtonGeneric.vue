<template>
  <div class="bar-button" :class="button_class" :title="title" v-on="$listeners"
    @mousedown="(e) => e.preventDefault()"
    @click="(e) => item.click ? item.click(e) : e.stopPropagation()">

    <span v-if="item.icon" class="baldr-icon baldr-icon_chevron-right">{{ item.icon }}</span>
    <span v-if="item.label" class="label">{{ item.label }}</span>
    <span v-if="item.html" class="label" v-html="item.html"></span>

    <span v-if="item.chevron === true" class="baldr-icon baldr-icon_chevron-right">expand_more</span>
    <span v-else-if="item.chevron" class="baldr-icon baldr-icon_chevron-right" v-html="item.chevron"></span>

    <component class="menu" v-if="item.submenu"
      :is="getComponent(item.submenu)"
      :submenu="item.submenu"
      :class="item.menu_class"
      :width="item.menu_width"
      :height="item.menu_height" />

  </div>
</template>

<script>
import BarMenu from './BarMenu.vue'

export default {
  components: {
    BarMenu
  },
  props: {
    item: {
      type: Object,
      required: true
    },
    is_open: Boolean
  },
  computed: {
    isMenu () { return this.item.submenu ? true : false; },
    button_class () {
      const open = this.is_open && this.isMenu;
      const active = this.item.active;
      const disabled = this.item.disabled;
      return { open, active, disabled };
    },
    title () {
      if (this.item.title) {
        let title = this.item.title;
        if (this.keyboardShortcut) title += " (" + this.keyboardShortcut + ")";
        return title;
      }
      else return false;
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
