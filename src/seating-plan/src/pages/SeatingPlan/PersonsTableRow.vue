<template>
  <tr
    :title="person.id"
    :key="person.lastname"
    @dragstart="dragStart"
    :draggable="draggable"
    class="people-item"
    :class="{ placed: person.seatNo }"
  >

    <td>
      {{ no }}.
    </td>

    <td>
      {{ person.lastName }}, {{ person.firstName }}
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
import { mapGetters, mapActions } from 'vuex'

// Components
import MaterialIcon from '@/components/MaterialIcon'
import PersonsJobs from '@/components/PersonsJobs'

export default {
  name: 'PersonsTableRow',
  props: {
    person: Object,
    no: Number
  },
  components: {
    MaterialIcon,
    PersonsJobs
  },
  computed: {
    ...mapGetters([
      'seats'
    ]),
    draggable () {
      if (!this.person.seatNo) return 'true'
      return 'false'
    }
  },
  methods: {
    ...mapActions([
      'deletePerson'
    ]),
    dragStart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    }
  }
}
</script>

<style scoped>
  [draggable="true"] {
    cursor: grab;
  }
  [draggable="true"]:hover {
    color: red;
  }
  [draggable="false"] {
    text-decoration: line-through;
    color: grey;
  }
</style>
