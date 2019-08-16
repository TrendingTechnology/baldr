<template>
  <div id="app">
    <nav id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/typography">Typography</router-link> |
      <router-link to="/css-markup">CSS markup</router-link> |
      <router-link to="/modal">Modal</router-link> |
      <router-link to="/dynamic-select">Dynamic select</router-link> |
      <router-link to="/material-icon">Material icon</router-link>
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

main {
  margin: 2vw;
}
</style>
