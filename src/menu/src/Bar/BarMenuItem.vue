<template>
  <div class="bar-menu-item"
    @mousedown="(e) => e.preventDefault()"
    @click="(e) => item.click ? item.click(e) : e.stopPropagation()"
    :class="{ disabled: item.disabled, active: item.active }"
    :title="item.title"
    :style="{ height: item.height+'px' }">

    <span v-if="item.icon" class="material-icons icon">{{ item.icon }}</span>
    <span v-if="item.text" class="label">{{ item.text }}</span>
    <span v-if="item.html" class="label" v-html="item.html"></span>
    <span v-if="item.hotkey" class="hotkey">{{ hotkey }}</span>

    <span v-if="item.menu && item.custom_chevron" class="chevron" v-html="item.custom_chevron"></span>
    <span v-else-if="item.menu" class="material-icons chevron">chevron_right</span>

    <component class="menu" v-if="item.menu"
      :is="get_component(item.menu)"
      :menu="item.menu"
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
  }
}
</script>
