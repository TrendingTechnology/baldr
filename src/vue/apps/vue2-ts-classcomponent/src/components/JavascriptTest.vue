<template>
  <div>
    <h1>Javascript Test Component</h1>

    <p @click="increment">{{ counter }}</p>
  </div>
</template>

<script lang="js">
/* eslint-disable */

import { increment } from '@/include-javascript.js'

export default {
  name: 'CursorArrows',
  data () {
    return {
      counter: 0
    }
  },
  methods: {
    increment () {
      this.counter = increment(this.counter)
      return null
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
