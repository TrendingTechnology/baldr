<template>
  <div id="app">
    <HelloWorld msg="Vue 2 Typescript Class Component Test App"/>
    <javascript-test/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import HelloWorld from './components/HelloWorld.vue'
import JavascriptTest from './components/JavascriptTest.vue'

@Component({
  components: {
    HelloWorld, JavascriptTest
  }
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
}
</style>
