<template>
  <div class="bar">
    <component v-for="(item, itemIndex) in content"
      :is="getComponent(item.is)"
      :key="'bar-item-' + itemIndex"
      :ref="'bar-item-' + itemIndex"
      :item="item"
      :class="item.class"
      :is_open="isOpen"
      @click="(event) => toggleMenu('bar-item-' + itemIndex, event)" />
  </div>
</template>

<script>
import ButtonGeneric from './ButtonGeneric.vue'
import BarSeparator from './BarSeparator.vue'
import BarSpacer from './BarSpacer.vue'

export default {
  components: {
    ButtonGeneric,
    BarSeparator,
    BarSpacer
  },
  props: {
    content: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      isOpen: false
    }
  },
  methods: {
    clickaway (e) {
      if(!this.$el.contains(e.target)) this.isOpen = false;
    },
    toggleMenu(name, event) {
      event.stopPropagation();
      const ref = this.$refs[name][0];
      const disabled = ref && ref.item && ref.item.disabled;
      const touch = event.sourceCapabilities && event.sourceCapabilities.firesTouchEvents;
      this.isOpen = ref && ref.isMenu && !disabled ? (touch ? true : !this.isOpen) : false;
    },
    getComponent(is) {
      if(is && !Array.isArray(is) && typeof is == "object") return is;
      else if(typeof is == "string") return "bar-"+is;
      else return "button-generic";
    }
  },

  mounted () {
    document.addEventListener("click", this.clickaway);
  },
  beforeDestroy () {
    document.removeEventListener("click", this.clickaway);
  }
}
</script>

<style lang="scss" scoped>
  @import "./bar-default-styles.scss";
</style>
