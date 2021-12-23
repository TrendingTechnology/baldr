<template>
  <div id="app" class="vc_app">
    <app-header :title="title" />
    <router-view></router-view>
    <app-footer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

@Component({
  components: {
    AppHeader,
    AppFooter
  }
})
export default class App extends Vue {
  get title () {
    if (this.$route.meta.title) {
      return this.$route.meta.title
    }
    return null
  }

  created () {
    this.$store.dispatch('importLatestState')
    window.addEventListener('beforeunload', event => {
      event.preventDefault()
      event.returnValue = ''
    })
    this.$store.dispatch('checkApi')
  }

  mounted () {
    this.$shortcuts.add(
      'ctrl+f',
      () => {
        this.$fullscreen()
      },
      'Fullscreen'
    )
    this.$shortcuts.add(
      'ctrl+s',
      () => {
        this.$store.dispatch('save')
      },
      'save'
    )
  }
}
</script>

<style lang="scss">
body {
  margin: 2px;
  font-size: 1.2vw;
  background-color: $white;
}

@page {
  size: A4 landscape;
  margin: 1em;
}
</style>
