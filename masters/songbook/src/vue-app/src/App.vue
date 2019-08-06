<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/table-of-contents">Inhaltsverzeichnis</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  beforeCreate: function () {
    this.$store.dispatch('importSongs')
  }
}
</script>

<style>
@import '~@bldr/theme-default/styles-ng.css';
</style>
