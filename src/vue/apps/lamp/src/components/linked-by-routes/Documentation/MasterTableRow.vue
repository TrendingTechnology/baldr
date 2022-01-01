<template>
  <tr class="vc_master_table_row">
    <td>
      <material-icon :name="master.icon.name" :color="master.icon.color" />
    </td>
    <td>
      <router-link
        :to="{
          name: 'documentation-master',
          params: { master: masterName }
        }"
      >
        {{ masterName }}
      </router-link>
    </td>
    <td>{{ displayName }}</td>
    <td>
      <router-link
        :to="{
          name: 'slides-preview',
          params: { presRef: `EP_master_${masterName}` }
        }"
      >
        <material-icon name="presentation" />
      </router-link>
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { masterCollection, MasterWrapper } from '@bldr/presentation-parser'

@Component
export default class MasterTableRow extends Vue {
  @Prop({
    type: String,
    required: true
  })
  masterName!: string

  get master (): MasterWrapper {
    return masterCollection[this.masterName]
  }

  get displayName (): string {
    return this.master.displayName
  }
}
</script>
