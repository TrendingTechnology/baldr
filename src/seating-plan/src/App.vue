<template>
  <div id="app">
    <SeatingPlan/>
    <PeopleList/>
  </div>
</template>

<script>
import SeatingPlan from './components/SeatingPlan.vue'
import PeopleList from './components/PeopleList.vue'

export default {
  name: 'app',
  components: {
    SeatingPlan, PeopleList
  }
}
</script>

<style>
body {
  margin: 2px;
}
#app {
  display: flex;
}
.people-list {
  flex-shrink: 2;
}
</style>
