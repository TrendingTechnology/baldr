<template>
  <div class="people-list">
    <ol>
      <person-item v-for="person in persons"
                  :person="person"
                  :key="person.id"
      />
    </ol>
  </div>
</template>

<script>
import PersonItem from './PersonItem.vue'

export default {
  name: 'PersonsList',
  components: {
    PersonItem
  },
  computed: {
    persons () {
      return this.$store.getters.personsByCurrentGrade
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
