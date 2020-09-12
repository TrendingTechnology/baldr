<template>
  <header class="vc_app_header">
    <vue-headful :title="title"/>
    <router-link v-if="isNotHome" to='/' class="back-link" title="zurück">
      <material-icon name="arrow-left"/>
    </router-link>
    <h1>{{ title }}</h1>
    <main-menu/>
  </header>
</template>

<script>
import vueHeadful from 'vue-headful'

// Components
import MainMenu from '@/components/layout/MainMenu'

export default {
  name: 'AppHeader',
  props: {
    title: String
  },
  components: {
    MainMenu,
    vueHeadful
  },
  computed: {
    isNotHome () {
      if (this.$route.path !== '/') {
        return true
      }
      return false
    }
  }
}
</script>

<style lang="scss">
  .vc_app_header {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;

    h1 {
      padding-left: 2em;
    }

    @media print {
      header {
        display: none;
      }
    }
  }
</style>
