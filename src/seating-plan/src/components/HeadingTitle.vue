<template>
  <header>
    <notifications position="top center"/>
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
import MainMenu from './MainMenu.vue'
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'HeadingTitle',
  props: {
    title: String
  },
  components: {
    MainMenu,
    MaterialIcon,
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

<style scoped>
  header {
    display: inline-flex;
    width: 100%;
    justify-content: space-between;
  }

  header h1 {
    padding-left: 2em;
  }
  @media print {
    .back-link {
      display: none;
    }
  }
</style>
