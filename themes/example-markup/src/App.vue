<template>
  <div id="app">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/typography">Typography</router-link> |
      <router-link to="/Modal">Modal</router-link>

    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
@import '~@bldr/theme-default/styles-ng.css';
</style>
