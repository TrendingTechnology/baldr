<template>
  <div :class="'mdi mdi-' + name"></div>
</template>

<script>
// import '@mdi/font'
export default {
  name: 'MaterialIcon',
  props: {
    name: String
  }
}
</script>

<style scoped>
  @import '../../node_modules/@mdi/font/css/materialdesignicons.css';
  div {
    cursor: pointer;
  }
  div:hover {
    color: red;
  }
</style>
