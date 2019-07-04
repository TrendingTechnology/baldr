<template>
  <div class="people-list">
    <ol>
      <people-item v-for="person in persons"
                  :person="person"
                  :key="person.id"
      />
    </ol>
  </div>
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
    persons () {
      return dataStore.getPersons(dataStore.getCurrentGrade())
    }
  }
}
</script>

<style scoped>
  .people-list {
    display: block;
    white-space: nowrap;
  }
  @media print {
    .people-list {
      display: none;
    }
  }
</style>
