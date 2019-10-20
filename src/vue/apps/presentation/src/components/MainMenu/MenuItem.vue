<template>
  <li class="vc_menu_item">
    <router-link
      @click.native="$modal.hide('menu')"
      :to="resolved.normalizedTo"
    >
      {{ linkText }}
    </router-link>
    <slot/>
  </li>
</template>

<script>
export default {
  name: 'MainItem',
  props: ['to', 'text'],
  computed: {
    resolved () {
      return this.$router.resolve(this.to)
    },
    linkText () {
      let text
      if (this.text) {
        text = this.text
      } else {
        text = this.resolved.route.meta.title
      }
      if (this.resolved.route.meta.shortcut) {
        text = `${text} (g ${this.resolved.route.meta.shortcut})`
      }
      return text
    }
  }
}
</script>
