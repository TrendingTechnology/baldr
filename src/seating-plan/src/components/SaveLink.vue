<template>
  <material-icon
    :disabled="!stateChanged"
    name="content-save"
    @click.native="saveToLocalStorage"
    title="lokal speichern"
  />
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import MaterialIcon from './MaterialIcon.vue'

export default {
  name: 'SaveLink',
  components: {
    MaterialIcon
  },
  computed: mapGetters(['stateChanged']),
  methods: {
    saveToLocalStorage () {
      localStorage.setItem('state', this.$store.getters.exportStateString)
      this.$store.commit('setStateChanged', false)
    },
    dateTime () {
      let date = new Date()
      let isoString = date.toISOString()
      isoString = isoString.replace(/\.\d+Z/, '')
      return isoString.replace(new RegExp(':', 'g'), '-')
    }
  }
}
</script>
