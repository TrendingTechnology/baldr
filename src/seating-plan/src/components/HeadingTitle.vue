<template>
  <header>
    <vue-headful :title="title"/>
    <router-link to='/' class="back-link">zurück</router-link>
    <h1>{{ title }}</h1>
    <material-icon name="content-save" @click.native="saveToLocalStorage"/>
  </header>
</template>

<script>
import vueHeadful from 'vue-headful'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'HeadingTitle',
  props: {
    title: String
  },
  components: {
    vueHeadful, MaterialIcon
  },
  methods: {
    saveToLocalStorage () {
      localStorage.setItem('state', this.$store.getters.exportStateString)
    }
  }
}
</script>

<style scoped>
  header {
    display: inline-flex;
    width: 100%;
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
