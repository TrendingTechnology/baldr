<template>
  <li
      :title="person.id"
      :key="person.lastname"
      @dragstart="eventListenerDragStart"
      :draggable="draggable"
      class="people-item"
      :class="{ placed: person.seatNo }"
  >
    {{ person.lastName }}, {{ person.firstName }}
    <persons-jobs :person="person"/>
  </li>
</template>

<script>
import { mapGetters } from 'vuex'
import PersonsJobs from './PersonsJobs.vue'

export default {
  name: 'PeopleItem',
  props: {
    person: Object
  },
  components: { PersonsJobs },
  computed: {
    ...mapGetters(['seats']),
    draggable () {
      if (this.person.seatNo >= 1 && this.person.seatNo <= this.seats.count) {
        return 'false'
      } else {
        return 'true'
      }
    }
  },
  methods: {
    eventListenerDragStart (event) {
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
