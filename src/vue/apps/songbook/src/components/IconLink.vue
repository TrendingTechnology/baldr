<template>
  <a class="vc_icon_link" :href="link" v-if="link">
    <material-icon :name="icon" :show-on-hover="showOnHover" size="3vw" />
  </a>
</template>

<script lang="ts">
import { Vue, Component, Prop } from '@bldr/vue-packages-bundler'

@Component
export default class IconLink extends Vue {
  @Prop({
    type: String
  })
  link!: string

  @Prop({
    type: String
  })
  icon!: string

  @Prop({
    default: false,
    type: Boolean
  })
  showOnHover!: boolean
}
</script>
