<template>
  <main class="vc_administer_persons">
    <section>
      <h1>Klassenliste der Klasse „{{ gradeNameCurrent }}“ verwalten</h1>
      <div class="list">
        <persons-table :start=1 :count=12 />
        <persons-table :start=13 :count=12 />
        <persons-table :start=25 :count=12 />
        <form-add-person/>
      </div>
    </section>
  </main>
</template>

<script lang="ts">
import FormAddPerson from './FormAddPerson.vue'
import PersonsTable from './PersonsTable.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'AdministerPersons',
  components: {
    FormAddPerson,
    PersonsTable
  },
  beforeCreate: function () {
    const grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  },
  computed: mapGetters(['gradeNameCurrent']),
  created: function () {
    const gradeName = this.$route.params.grade
    this.$store.commit('setGradeNameCurrent', gradeName)
  },
  methods: {
    rename (person, property, event) {
      const newValue = event.target.innerText
      const payload = {
        person: person
      }
      if (property === 'firstName') {
        payload.newFirstName = newValue
      } else if (property === 'lastName') {
        payload.newLastName = newValue
      }
      this.$store.commit('renamePerson', payload)
    }
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
