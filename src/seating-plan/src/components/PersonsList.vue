<template>
  <div class="people-list">
    <ol>
      <person-item
        v-for="person in personsByCurrentGrade"
        :person="person"
        :key="person.id"
      />
    </ol>
  <input v-model="lastName" type="text" placeholder="Nachname">
  <input v-model="firstName" type="text" placeholder="Vorname" @keyup.enter="addPerson">
  <button @click="addPerson">hinzufügen</button>
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
  computed: mapGetters(['personsByCurrentGrade', 'currentGrade']),
  methods: {
    addPerson () {
      if (this.lastName && this.firstName) {
        this.$store.dispatch('addPerson', { firstName: this.firstName, lastName: this.lastName, grade: this.currentGrade })
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
