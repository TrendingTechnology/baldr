<template>
  <div class="vc_task_master_preview">
    <div class="inner" v-html="markup" />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterPreview from '../MasterPreview.vue'

@Component
export default class TaskMasterPreview extends MasterPreview {
  masterName = 'task'

  @Prop({
    type: String,
    required: true
  })
  markup!: string
}
</script>

<style lang="scss">
.vc_task_master_preview {
  display: flex;
  flex-direction: column;
  font-size: 1em;
  height: 100%;
  justify-content: center;
  text-align: center;
  width: 100%;

  .inner {
    margin: 1em;
    padding: 1em;
  }
}
</style>
