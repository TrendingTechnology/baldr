<template>
  <tr>
    <td>
      <router-link :to="{ name: 'common-example', params: { exampleName } }">
        {{ exampleName }}
      </router-link>
    </td>
    <td>
      <router-link
        :to="{
          name: 'slides-preview',
          params: { presRef: `EP_common_${exampleName}` }
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

@Component
export default class CommonExampleTableRow extends Vue {
  @Prop({
    type: String,
    required: true
  })
  exampleName!: string
}
</script>
