<template>
  <div class="bar-button" :class="button_class" :title="title" v-on="$listeners"
    @mousedown="(e) => e.preventDefault()"
    @click="(e) => item.click ? item.click(e) : e.stopPropagation()">

    <span v-if="item.icon" class="material-icons icon">{{ item.icon }}</span>
    <span v-if="item.text" class="label">{{ item.text }}</span>
    <span v-if="item.html" class="label" v-html="item.html"></span>

    <span v-if="item.chevron === true" class="material-icons chevron">expand_more</span>
    <span v-else-if="item.chevron" class="chevron" v-html="item.chevron"></span>

    <component class="menu" v-if="item.menu"
      :is="get_component(item.menu)"
      :menu="item.menu"
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
    is_menu () { return this.item.menu ? true : false; },
    button_class () {
      const open = this.is_open && this.is_menu;
      const active = this.item.active;
      const disabled = this.item.disabled;
      return { open, active, disabled };
    },
    title () {
      if(this.item.title){
        let title = this.item.title;
        if(this.hotkey) title += " ("+this.hotkey+")";
        return title;
      }
      else return false;
    }
  }
}
</script>
