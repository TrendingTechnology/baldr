import { Component } from '@bldr/vue-packages-bundler'

// Register the router hooks with their names
// https://class-component.vuejs.org/guide/additional-hooks.html
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])
