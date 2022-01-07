<template>
  <tr :title="person.id" :key="person.id" class="vc_persons_table_row">
    <td>{{ no }}.</td>

    <td contenteditable @blur="rename(person, 'lastName', $event)">
      {{ person.lastName }}
    </td>

    <td contenteditable @blur="rename(person, 'firstName', $event)">
      {{ person.firstName }}
    </td>

    <td>
      <persons-jobs :person="person" />
    </td>

    <td>
      <material-icon name="delete" @click.native="deletePerson(person)" />
    </td>
  </tr>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'
import { mapActions } from 'vuex'

import PersonsJobs from '@/components/PersonsJobs.vue'
import { Person } from '../../types'

@Component({
  components: {
    PersonsJobs
  },
  methods: {
    ...mapActions(['deletePerson'])
  }
})
export default class PersonsTableRow extends Vue {
  @Prop()
  person!: Person

  @Prop()
  no!: Number

  rename (person: Person, property: string, event: Event) {
    const element = <HTMLElement>event.target
    const newValue = element.innerText
    const payload = {
      person: person,
      newFirstName: '',
      newLastName: ''
    }
    if (property === 'firstName') {
      payload.newFirstName = newValue
    } else if (property === 'lastName') {
      payload.newLastName = newValue
    }
    this.$store.commit('renamePerson', payload)
  }
}
</script>
