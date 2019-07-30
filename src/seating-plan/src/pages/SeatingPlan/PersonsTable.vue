<template>
  <table class="persons-list">
    <persons-table-row
      v-for="(person, index) in personsByGradeAsListSortedCurrent"
      :person="person"
      :no="index + 1"
      :key="person.id"
    />
  </table>

</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonsTableRow from './PersonsTableRow'

export default {
  name: 'PersonsTable',
  components: {
    PersonsTableRow
  },
  computed: mapGetters([
    'personsByGradeAsListSortedCurrent',
    'gradeNameCurrent'
  ])
}
</script>

<style scoped>

</style>
