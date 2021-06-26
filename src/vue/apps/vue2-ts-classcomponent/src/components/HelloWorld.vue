<template>
  <div>
    <h1>{{ msg }}</h1>

    <p @click="increment">{{ counter }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import { increment } from '@/include-javascript.js'

@Component
export default class HelloWorld extends Vue {
  @Prop()
  private msg!: string

  /**
   * Zähler
   */
  private counter = 0

  increment (): void {
    this.counter = increment(this.counter)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
