<template>
  <aside id="persons-sidebar">
    <router-link :to="'/grade/' + gradeNameCurrent + '/administer-persons'">Personen verwalten</router-link>
    <persons-table/>
  </aside>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonsList from './PersonsList'

export default {
  name: 'PersonsSidebar',
  components: {
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
  ])
}
</script>

<style scoped>
  #persons-sidebar {
    display: block;
    white-space: nowrap;
  }

  @media print {
    #persons-sidebar {
      display: none;
    }
  }
</style>
