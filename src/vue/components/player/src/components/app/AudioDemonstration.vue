<template>
  <div>Audio</div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { Resolver } from '@bldr/media-resolver-ng'

@Component
export default class AudioDemonstration extends Vue {
  @Prop() private msg!: string

  async mounted () {
    const resolver = new Resolver()
    const assets = await resolver.resolve('uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e')
    console.log(assets)
  }
}
</script>
