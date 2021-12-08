<template>
  <dynamic-select
    :options="persons"
    @input="placePerson"
    v-model="selectedPerson"
    placeholder="Suche eine/n SchülerIn"
    class="vc_person_select"
  />
</template>

<script lang="ts">
import { Component, Vue } from '@bldr/vue-packages-bundler'
import { Person } from '../types'

@Component
export default class PersonSelect extends Vue {
  selectedPerson: Person | null

  constructor () {
    super()
    this.selectedPerson = null
  }

  get persons () {
    const personsOrig = this.$store.getters.personsByGradeAsListSortedCurrent
    if (personsOrig) {
      const persons = []
      for (const person of personsOrig) {
        if (!person.seatNo) {
          persons.push({
            id: person.id,
            name: `${person.lastName}, ${person.firstName}`
          })
        }
      }
      return persons
    }
    return []
  }

  placePerson () {
    this.$store.dispatch('placePerson', {
      seatNo: this.$store.getters.seatNoCurrent,
      personId: this.selectedPerson!.id
    })
    this.$modal.hide('person-select')
  }
}
</script>
