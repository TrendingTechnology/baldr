<template>
  <div class="seating-plan-view">
    <heading-title :title="title"/>
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
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan,
    PeopleList,
    HeadingTitle
  },
  computed: {
    currentGrade () {
      return dataStore.getCurrentGrade()
    },
    title () {
      return 'Sitzplan der Klasse “' + this.currentGrade + '”'
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
