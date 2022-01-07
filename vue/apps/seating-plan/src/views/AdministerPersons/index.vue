<template>
  <main class="vc_administer_persons">
    <section>
      <h1>Klassenliste der Klasse „{{ gradeNameCurrent }}“ verwalten</h1>
      <div class="list">
        <persons-table :start="1" :count="12" />
        <persons-table :start="13" :count="12" />
        <persons-table :start="25" :count="12" />
        <form-add-person />
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { mapGetters } from 'vuex'

import FormAddPerson from './FormAddPerson.vue'
import PersonsTable from './PersonsTable.vue'

import { Person } from '../../types'

@Component({
  components: {
    FormAddPerson,
    PersonsTable
  },
  computed: mapGetters(['gradeNameCurrent'])
})
export default class AdministerPersons extends Vue {
  beforeCreate () {
    const grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  }

  created () {
    const gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  }

  rename (person: Person, property: string, event: Event) {
    const element = <HTMLElement>event.target
    const newValue = element.innerText
    const payload = {
      person: person,
      newFirstName: '',
      newLastName: ''
    }
    if (property === 'firstName') {
      payload.newFirstName = newValue
    } else if (property === 'lastName') {
      payload.newLastName = newValue
    }
    this.$store.commit('renamePerson', payload)
  }
}
</script>

<style lang="scss">
.vc_administer_persons {
  padding: 0 3vw;

  .list {
    column-count: 3;
  }
}
</style>
