<template>
  <div class="vc_task_master bigger" v-html="markup" />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

@Component
export default class TaskMasterMain extends MasterMain {
  masterName = 'task'

  @Prop({
    type: String,
    required: true
  })
  markup: string
}
</script>

<style lang="scss">
.vc_task_master {
  margin: 2em;
  padding: 3em;
  text-align: center;

  ol,
  ul {
    text-align: left !important;
    margin: 0em 3em;
  }
}
</style>
