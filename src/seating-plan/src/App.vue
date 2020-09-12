<template>
  <div id="app" class="vc_app">
    <app-header :title="title"/>
    <router-view></router-view>
    <app-footer/>
  </div>
</template>

<script>
// Components
import AppHeader from '@/components/layout/AppHeader.vue'
import AppFooter from '@/components/layout/AppFooter.vue'

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
  },
  mounted: function () {
    this.$shortcuts.add('f f', () => { this.$fullscreen() }, 'Fullscreen')
    this.$shortcuts.add('ctrl+s', () => { this.$store.dispatch('save') }, 'save')
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
    margin: 2em;
  }
</style>
