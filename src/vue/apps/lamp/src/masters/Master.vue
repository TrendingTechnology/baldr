<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { LampTypes } from '@bldr/type-definitions'
import { masterCollection } from '../masters.js'

@Component
export default class Master extends Vue {
  /**
   * The name of the master slide. A short name in lower case letters
   * like `audio`.
   */
  masterName: string

  get master (): LampTypes.Master {
    return masterCollection.get(this.masterName)
  }
}
</script>
