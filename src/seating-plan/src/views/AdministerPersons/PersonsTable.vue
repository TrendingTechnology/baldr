<template>
  <table>
    <persons-table-row
      v-for="(person, index) in persons()"
      :person="person"
      :no="start + index"
      :key="person.id"
    />
  </table>
</template>

<script>
import { mapGetters } from 'vuex'

// Components
import PersonsTableRow from './PersonsTableRow.vue'

export default {
  name: 'PersonsTable',
  props: {
    start: {
      type: Number,
      default: 1
    },
    count: {
      type: Number,
      default: undefined
    }
  },
  components: {
    PersonsTableRow
  },
  computed: mapGetters([
    'personsByGradeAsListSortedCurrent'
  ]),
  methods: {
    persons () {
      const persons = this.personsByGradeAsListSortedCurrent
      const start = this.start - 1
      let end
      if (!this.count) {
        end = undefined
      } else {
        end = start + this.count
      }
      return persons.slice(start, end)
    }
  }
}
</script>
