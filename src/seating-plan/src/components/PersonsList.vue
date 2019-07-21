<template>
  <div class="people-list">
    <ol>
      <person-item
        v-for="person in personsByGradeAsListSortedCurrent"
        :person="person"
        :key="person.id"
      />
    </ol>
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
      <button>hinzufügen</button>
    </form>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonItem from './PersonItem.vue'

export default {
  name: 'PersonsList',
  components: {
    PersonItem
  },
  data: function () {
    return {
      lastName: '',
      firstName: ''
    }
  },
  computed: mapGetters(['personsByGradeAsListSortedCurrent', 'gradeNameCurrent']),
  methods: {
    createPerson () {
      if (this.lastName && this.firstName) {
        this.$store.dispatch('createPerson', { firstName: this.firstName, lastName: this.lastName, grade: this.gradeNameCurrent })
        this.lastName = ''
        this.firstName = ''
      }
    }
  }
}
</script>

<style scoped>
  .people-list {
    display: block;
    white-space: nowrap;
  }
  @media print {
    .people-list {
      display: none;
    }
  }
</style>
