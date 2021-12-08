// https://class-component.vuejs.org/guide/additional-hooks.html
import { Component } from '@bldr/vue-packages-bundler'

// Register the router hooks with their names
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
