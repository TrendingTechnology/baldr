<template>
  <ol>
    <persons-list-item
      v-for="(person, index) in personsByGradeAsListSortedCurrent"
      :person="person"
      :no="index + 1"
      :key="person.id"
    />
  </ol>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonsListItem from './PersonsListItem'

export default {
  name: 'PersonsTable',
  components: {
    PersonsListItem
  },
  computed: mapGetters([
    'personsByGradeAsListSortedCurrent'
  ])
}
</script>

<style scoped>

</style>
