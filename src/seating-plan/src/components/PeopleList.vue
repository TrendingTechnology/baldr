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

export default {
  name: 'PeopleList',
  components: {
    PeopleItem
  },
  computed: {
    persons () {
      return this.$store.getters.getPersonsByCurrentGrade
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
