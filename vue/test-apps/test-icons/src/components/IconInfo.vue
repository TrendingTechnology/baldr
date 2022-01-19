<template>
  <section class="vc_icon_info">
    <plain-icon :name="name" />
    <span class="icon-name">{{ name }}</span>
    <p v-if="def.materialName">materialName: {{ def.materialName }}</p>
    <p v-if="def.fileName">fileName: {{ def.fileName }}</p>
    <p v-if="def.description">description: {{ def.description }}</p>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { IconTypes } from '@bldr/type-definitions'

@Component
export default class IconInfo extends Vue {
  @Prop()
  name!: string

  get def (): IconTypes.IconDefintion {
    return config.iconFont.iconMapping[this.name]
  }
}
</script>

<style lang="scss">
.vc_icon_info {
  margin-bottom: 2%;
  border: solid 1px;
  break-inside: avoid-column;
  padding: 1em;
  position: relative;

  .icon-name {
    font-size: 2em;
    font-weight: bold;
    position: absolute;
    right: 3%;
    top: 5%;
  }
}
</style>
