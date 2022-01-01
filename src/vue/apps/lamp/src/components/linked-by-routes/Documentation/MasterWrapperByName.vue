<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { masterCollection, Master } from '@bldr/presentation-parser'

@Component
export default class MasterByName extends Vue {
  masterName!: string

  get master (): Master {
    return masterCollection[this.masterName]
  }
}
</script>
