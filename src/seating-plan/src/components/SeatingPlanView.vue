<template>
  <div class="seating-plan-view">
    <h1>Sitzplan der Klasse “{{ currentGrade }}”</h1>
    <section>
      <seating-plan/>
      <people-list/>
    </section>

  </div>
</template>

<script>
import SeatingPlan from './SeatingPlan.vue'
import PeopleList from './PeopleList.vue'
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan, PeopleList
  },
  computed: {
    currentGrade () {
      return dataStore.getCurrentGrade()
    }
  },
  created: function () {
    let grade = this.$route.params.grade
    dataStore.setCurrentGrade(grade)
  }
}
</script>

<style scoped>
.seating-plan-view section {
  display: flex;
  align-items: stretch;
}
.people-list {
  flex-basis: content;
}
</style>
