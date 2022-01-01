<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { masterCollection, MasterWrapper } from '@bldr/presentation-parser'

@Component
export default class MasterWrapperByName extends Vue {
  masterName!: string

  get master (): MasterWrapper {
    return masterCollection[this.masterName]
  }
}
</script>
