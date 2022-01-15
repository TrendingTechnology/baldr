<template>
  <section>
    <material-icon :name="name" />
    <span class="description">{{ name }}</span>
    <p v-if="def.materialName">materialName: {{ def.materialName }}</p>
    <p v-if="def.fileName">fileName: {{ def.fileName }}</p>
    <p v-if="def.description">description: {{ def.description }}</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { MaterialIcon } from '@bldr/icons'
import { IconTypes } from '@bldr/type-definitions'

@Component({ components: { MaterialIcon } })
export default class AllIcons extends Vue {
  @Prop()
  name!: string

  get def (): IconTypes.IconDefintion {
    return config.iconFont.iconMapping[this.name]
  }
}
</script>
