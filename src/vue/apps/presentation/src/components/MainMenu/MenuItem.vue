<template>
  <li>
    <router-link
      @click.native="$modal.hide('menu')"
      :to="resolved.normalizedTo"
    >
      {{ resolved.route.meta.title }}
    </router-link>
  </li>
</template>

<script>
export default {
  name: 'MainItem',
  props: ['to'],
  computed: {
    resolved () {
      return this.$router.resolve(this.to)
    }
  }
}
</script>
