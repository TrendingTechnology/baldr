<template>
  <table class="vc_persons_table">
    <persons-table-row
      v-for="(person, index) in persons()"
      :person="person"
      :no="start + index"
      :key="person.id"
    />
  </table>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mapGetters } from 'vuex'

import PersonsTableRow from './PersonsTableRow.vue'
import { Person } from '../../types'

@Component({
  components: {
    PersonsTableRow
  },
  computed: mapGetters(['personsByGradeAsListSortedCurrent'])
})
export default class PersonsTable extends Vue {
  @Prop({
    type: Number,
    default: 1
  })
  start!: number

  @Prop({
    type: Number,
    default: undefined
  })
  count!: number

  personsByGradeAsListSortedCurrent!: Person[]

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
</script>
