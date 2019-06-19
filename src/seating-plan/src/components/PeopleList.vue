<template>
  <ol class="people-list">
    <people-item v-for="person in peopleList"
                 :person="person"
                 :key="person.id"
    />
  </ol>
</template>

<script>
import PeopleItem from './PeopleItem.vue'

export default {
  name: 'PeopleList',
  components: {
    PeopleItem
  },
  computed: {
    peopleList() {
      return this.$root.$data.seatingPlan.people.flattenList()
    }
  }
}
</script>

<style scoped>
  .people-list {
    display: block;
    white-space: nowrap;
  }
</style>
