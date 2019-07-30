<template>
  <aside id="persons-sidebar">
    <router-link :to="'/grade/' + gradeNameCurrent + '/persons'">Personen verwalten</router-link>
    <ol>
      <persons-table/>
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
      <button><material-icon name="plus-box-outline"/></button>
    </form>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import MaterialIcon from '@/components/MaterialIcon'
import PersonsTable from './PersonsTable'

export default {
  name: 'PersonsSidebar',
  components: {
    MaterialIcon,
    PersonsTable
  },
  data: function () {
    return {
      lastName: '',
      firstName: ''
    }
  },
  computed: mapGetters([
    'gradeNameCurrent',
    'personsByGradeAsListSortedCurrent'
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
  #persons-sidebar {
    display: block;
    white-space: nowrap;
  }

  #persons-sidebar form {
    padding-left: 1em;
  }

  #persons-sidebar input {
    max-width: 5em;
  }

  @media print {
    #persons-sidebar {
      display: none;
    }
  }
</style>
