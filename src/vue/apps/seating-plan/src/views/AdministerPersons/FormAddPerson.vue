<template>
  <form @submit.prevent="createPerson" class="vc_form_add_person">
    <input
      v-model="lastName"
      type="text"
      placeholder="Nachname"
      @keyup.enter="createPerson"
    />
    <input
      v-model="firstName"
      type="text"
      placeholder="Vorname"
      @keyup.enter="createPerson"
    />
    <button>hinzufügen</button>
  </form>
</template>

<script lang="ts">
import { Component, Vue, mapGetters } from '@bldr/vue-packages-bundler'

@Component({
  computed: mapGetters(['gradeNameCurrent'])
})
export default class FormAddPerson extends Vue {
  lastName = ''
  firstName = ''
  gradeNameCurrent!: string

  createPerson (): void {
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
</script>

<style lang="scss">
.vc_form_add_person {
  padding-left: 1em;

  input {
    max-width: 5em;
  }
}
</style>
