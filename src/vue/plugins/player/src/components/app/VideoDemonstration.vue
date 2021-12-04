<template>
  <div>Video</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from '@bldr/vue-packages-bundler'

@Component
export default class VideoDemonstration extends Vue {
  @Prop() private msg!: string
}
</script>
