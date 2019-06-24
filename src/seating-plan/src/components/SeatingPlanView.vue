<template>
  <div class="seating-plan-view">
    <dynamic-select-overlay/>
    <heading-title :title="title"/>
    <section>
      <seating-plan/>
      <people-list/>
    </section>
  </div>
</template>

<script>
import HeadingTitle from './HeadingTitle.vue'
import DynamicSelectOverlay from './DynamicSelectOverlay.vue'
import SeatingPlan from './SeatingPlan.vue'
import PeopleList from './PeopleList.vue'
import dataStore from '../data-store.js'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan,
    PeopleList,
    HeadingTitle,
    DynamicSelectOverlay
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
  position: relative;
}

.people-list {
  flex-basis: content;
}
</style>
