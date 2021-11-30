<template>
  <div>Audio</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { resolver, playerCache } from '../../app'

@Component
export default class AudioDemonstration extends Vue {

  async mounted () {
    const uri = 'uuid:127abf7e-8b86-4bc3-8064-88efbc4c7f9e'
    await resolver.resolve(uri)
    const playable = playerCache.getPlayable(uri)
    console.log(playable)
  }
}
</script>
