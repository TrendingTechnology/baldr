<template>
  <div class="vc_task_master_preview">
    <div class="inner" v-html="markup"/>
  </div>
</template>

<script>

export default {
  props: ['markup']
}
</script>

<style lang="scss" scoped>
  .vc_task_master_preview {
    display: flex;
    flex-direction: column;
    font-size: 2vw;
    height: 100%;
    justify-content: center;
    text-align: center;
    width: 100%;
    .inner {
      margin: 1vw;
      padding: 1vw;
    }
  }
</style>
