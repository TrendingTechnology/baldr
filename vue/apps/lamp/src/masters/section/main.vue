<template>
  <div class="vc_section_master main-app-padding" v-html="heading" />
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

@Component
export default class SectionMasterMain extends MasterMain {
  masterName = 'section'

  @Prop({
    type: String,
    required: true
  })
  heading!: string
}
</script>

<style lang="scss">
.vc_section_master {
  font-family: $font-family-sans-small-caps;
  font-weight: bold;
  text-align: center;
}
</style>
