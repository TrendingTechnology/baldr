<template>
  <header>
    <vue-headful :title="title"/>
    <router-link to='/' class="back-link">zurück</router-link>
    <h1>{{ title }}</h1>
    <material-icon :disabled="!stateChanged" name="content-save" @click.native="saveToLocalStorage"/>
  </header>
</template>

<script>
import vueHeadful from 'vue-headful'
import { mapGetters } from 'vuex'

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
  computed: mapGetters(['stateChanged']),
  methods: {
    saveToLocalStorage () {
      localStorage.setItem('state', this.$store.getters.exportStateString)
      this.$store.commit('setStateChanged', false)
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
