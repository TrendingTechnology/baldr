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
    font-size: 4vw;
    margin: 3vw;
    padding: 4vw;
    text-align: center;

    ol, ul {
      text-align: left !important;
      font-size: 3vw;
      margin: 0em 3em;
    }
  }
</style>
