<template>
  <form @submit="createPerson">
    <input
      v-model="lastName"
      type="text"
      placeholder="Nachname"
      @keyup.enter="createPerson"
    >
    <input
      v-model="firstName"
      type="text"
      placeholder="Vorname"
      @keyup.enter="createPerson"
    >
    <button><material-icon name="plus-box-outline"/></button>
  </form>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import { MaterialIcon } from '@bldr/vue-components'

export default {
  name: 'FormAddPerson',
  components: {
    MaterialIcon
  },
  data: function () {
    return {
      lastName: '',
      firstName: ''
    }
  },
  computed: mapGetters([
    'gradeNameCurrent'
  ]),
  methods: {
    createPerson () {
      if (this.lastName && this.firstName) {
        this.$store.dispatch('createPerson', {
          firstName: this.firstName,
          lastName: this.lastName,
          grade: this.gradeNameCurrent
        })
        this.lastName = ''
        this.firstName = ''
      }
    }
  }
}
</script>

<style scoped>
  form {
    padding-left: 1em;
  }

  input {
    max-width: 5em;
  }
</style>
