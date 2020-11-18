<template>
  <form @submit.prevent="createPerson" class="vc_form_add_person">
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
    <button>hinzufügen</button>
  </form>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  name: 'FormAddPerson',
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

<style lang="scss">
  .vc_form_add_person {
    padding-left: 1em;

    input {
      max-width: 5em;
    }
  }
</style>
