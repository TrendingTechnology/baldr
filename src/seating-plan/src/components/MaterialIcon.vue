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
    display: inline-block;
  }
  div:hover {
    color: red;
  }
  div:active {
    color: grey;
  }
  div:focus {
    color: slategray;
  }
</style>
