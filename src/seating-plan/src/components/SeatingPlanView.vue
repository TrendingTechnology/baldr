<template>
  <div class="seating-plan-view">
    <vue-headful :title="title"/>
    <header>
      <router-link to='/' class="back-link">zurück</router-link>
      <h1>{{ title }}</h1>
    </header>
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
import vueHeadful from 'vue-headful'

export default {
  name: 'SeatingPlanView',
  components: {
    SeatingPlan,
    PeopleList,
    vueHeadful
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
header {
  display: inline-flex;
}

h1 {
  padding-left: 2em;
}

.seating-plan-view section {
  display: flex;
  align-items: stretch;
}

.people-list {
  flex-basis: content;
}
</style>
