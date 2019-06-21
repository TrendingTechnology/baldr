<template>
  <li
      :title="person.id"
      :key="person.lastname"
      @dragstart="eventListenerDragStart"
      :draggable="draggable"
      class="people-item"
      :class="{ placed: person.placed }"
  >
    {{ person.lastName }}, {{ person.firstName }}
  </li>
</template>

<script>
import dataStore from '../data-store.js'
let seats = dataStore.getData().seats

export default {
  name: 'PeopleItem',
  props: {
    person: Object
  },
  computed: {
    draggable () {
      if (this.person.seatNo >= 1 && this.person.seatNo <= seats.count) {
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
