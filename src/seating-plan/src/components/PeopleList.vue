<template>
  <ol class="people-list">
    <li v-for="person in peopleList" :key="person.lastname">{{ person.lastName }}, {{ person.firstName }}</li>
  </ol>
</template>

<script>
export default {
  name: 'PeopleList',
  computed: {
    peopleList() {
      return this.$root.$data.seatingPlan.people.flattenList()
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
