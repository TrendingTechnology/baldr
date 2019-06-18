<template>
  <ol class="people-list">
    <li v-for="person in peopleList" :key="person.lastname">{{ person.lastName }}, {{ person.firstName }}</li>
  </ol>
</template>

<script>
export default {
  name: 'PeopleList',
  props: {
    people: Object
  },
  computed: {
    peopleList() {
      return this.people.flattenList()
    }
  }
}
</script>

<style scoped>
  .people-list {
    width: 100%;
    background-color: rosybrown;
  }
</style>
