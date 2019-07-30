<template>
  <main>
    <section>
      <ol>
        <li
          v-for="person in personsByGradeAsListSortedCurrent"
          :key="person.id"
        >
          <span
            contenteditable
            @blur="rename(person, 'lastName', $event)"
          >{{ person.lastName }}</span>,
          <span
            contenteditable
            @blur="rename(person, 'firstName', $event)"
          >{{ person.firstName }}</span>
        </li>
      </ol>

    </section>

  </main>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'PersonsAdmin',
  computed: mapGetters([
    'personsByGradeAsListSortedCurrent'
  ]),
  beforeCreate: function () {
    let grade = this.$route.params.grade
    if (!this.$store.getters.grade(grade)) {
      this.$router.push('/')
    }
  },
  created: function () {
    let gradeName = this.$route.params.grade
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

<style scoped>
  section {
    column-count: 3;
  }
</style>
