<template>
  <tr
    :title="person.id"
    :key="person.id"
    class="vc_persons_table_row"
  >
    <td>
      {{ no }}.
    </td>

    <td
      contenteditable
      @blur="rename(person, 'lastName', $event)"
    >
      {{ person.lastName }}
    </td>

    <td
      contenteditable
      @blur="rename(person, 'firstName', $event)"
    >
      {{ person.firstName }}
    </td>

    <td>
      <persons-jobs :person="person"/>
    </td>

    <td>
      <material-icon
        name="delete"
        @click.native="deletePerson(person)"
      />
    </td>

  </tr>
</template>

<script>
import { mapActions } from 'vuex'

// Components
import PersonsJobs from '@/components/PersonsJobs.vue'

export default {
  name: 'PersonsTableRow',
  props: {
    person: Object,
    no: Number
  },
  components: {
    PersonsJobs
  },
  methods: {
    ...mapActions([
      'deletePerson'
    ]),
    rename (person, property, event) {
      const newValue = event.target.innerText
      const payload = {
        person: person
      }
      if (property === 'firstName') {
        payload.newFirstName = newValue
      } else if (property === 'lastName') {
        payload.newLastName = newValue
      }
      this.$store.commit('renamePerson', payload)
    }
  }
}
</script>
