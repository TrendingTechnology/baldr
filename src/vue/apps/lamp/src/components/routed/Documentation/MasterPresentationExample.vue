<template>
  <presentation-example
    class="vc_master_presentation_example"
    :pres-ref="ref"
    :yaml-markup="yamlMarkup"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import PresentationExample from './PresentationExample.vue'

@Component({
  components: {
    PresentationExample
  }
})
export default class MasterPresentationExample extends Vue {
  @Prop({
    type: String,
    required: true
  })
  masterName!: string

  get ref (): string {
    return `EP_master_${this.masterName}`
  }

  get yamlMarkup (): string {
    return rawYamlExamples.masters[this.masterName]
  }
}
</script>
