<template>
  <li
      :title="person.id"
      :key="person.lastname"
      @dragstart="dragstart"
      draggable="true"
      class="people-item"
      :class="{ placed: person.placed }"
  >
    {{ person.lastName }}, {{ person.firstName }}
  </li>
</template>

<script>
export default {
  name: 'PeopleItem',
  props: {
    person: Object
  },
  methods: {
    dragstart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    }
  }
}
</script>

<style scoped>
  /* .people-item {
    opacity: 0.5;
  } */
  .people-item[draggable="true"] {
    cursor: grab;
  }
  .people-item[draggable="true"]:hover {
    color: red;
  }
  .people-item[draggable="false"] {
    text-decoration: line-through;
  }
</style>
