<template>
  <div>
    <router-link @click.native="$modal.hide('menu')"
      v-for="route in $router.options.routes"
      :key="route.path"
      :to="route.path">
    {{ route.name }}
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'MainMenu'
}
</script>

<style lang="scss" scoped>

</style>
