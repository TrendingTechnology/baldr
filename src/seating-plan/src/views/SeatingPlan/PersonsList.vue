<template>
  <ol class="vc_persons_list">
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
import PersonsListItem from './PersonsListItem.vue'

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

<style lang="scss">
  .vc_persons_list {
    font-size: 1.8vh;
  }
</style>
