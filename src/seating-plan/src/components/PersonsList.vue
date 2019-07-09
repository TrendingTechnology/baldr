<template>
  <div class="people-list">
    <ol>
      <person-item
        v-for="person in personsByCurrentGrade"
        :person="person"
        :key="person.id"
      />
    </ol>
  </div>
</template>

<script>
import PersonItem from './PersonItem.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PersonsList',
  components: {
    PersonItem
  },
  computed: mapGetters(['personsByCurrentGrade'])
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
