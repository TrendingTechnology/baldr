<template>
  <div id="app">
    <app-header :title="title"/>
    <router-view></router-view>
    <app-footer/>
  </div>
</template>

<script>

// Components
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

import '@bldr/theme-default-css'

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter
  },
  computed: {
    title () {
      if (this.$route.meta.title) {
        return this.$route.meta.title
      }
      return null
    }
  },
  created: function () {
    this.$store.dispatch('importLatestState')

    window.addEventListener('beforeunload', event => {
      event.preventDefault()
      event.returnValue = ''
    })

    this.$store.dispatch('checkApi')
  }
}
</script>

<style>
  @import '~@bldr/theme-default-css/styles.css';

  body {
    margin: 2px;
    font-size: 1.2vw;
  }

  @page {
    size: A4 landscape;
    margin: 2em;
  }
</style>
