<template>
  <div class="vc_task_master" v-html="markup"/>
</template>

<script>
export default {
  props: {
    markup: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss">
  .vc_task_master {
    font-size: 3em;
    margin: 2em;
    padding: 3em;
    text-align: center;

    ol, ul {
      text-align: left !important;
      font-size: 3em;
      margin: 0em 3em;
    }
  }
</style>
