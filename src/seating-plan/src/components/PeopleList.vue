<template>
  <ol class="people-list">
    <li draggable="true" v-for="person in peopleList"
        :key="person.lastname"
        @dragstart="dragstart"
    >
      {{ person.lastName }}, {{ person.firstName }}
    </li>
  </ol>
</template>

<script>
export default {
  name: 'PeopleList',
  computed: {
    peopleList() {
      return this.$root.$data.seatingPlan.people.flattenList()
    }
  },
  methods: {
    dragstart (event) {
      event.dataTransfer.dropEffect = "move"
      event.dataTransfer.setData("text/plain", 'lol')
    }
  }
}
</script>

<style scoped>
  .people-list {
    width: 100%;
    background-color: rosybrown;
  }
  .people-list li {
    opacity: 0.5;
    cursor: grab;
  }
  .people-list li:hover {
    opacity: 1;
  }
</style>
