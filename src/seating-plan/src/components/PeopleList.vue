<template>
  <ol class="people-list">
    <people-item v-for="person in persons"
                 :person="person"
                 :key="person.id"
    />
  </ol>
</template>

<script>
import PeopleItem from './PeopleItem.vue'
import dataStore from '../data-store.js'

export default {
  name: 'PeopleList',
  components: {
    PeopleItem
  },
  computed: {
    persons() {
      return dataStore.getPersons()
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
