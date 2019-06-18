<template>
  <div id="app">
    <SeatingPlan :seatingPlan="seatingPlan"/>
    <PeopleList :people="people"/>
  </div>
</template>

<script>
import Seat from './components/Seat.vue'
import SeatingPlan from './components/SeatingPlan.vue'
import PeopleList from './components/PeopleList.vue'

export default {
  name: 'app',
  components: {
    Seat, SeatingPlan, PeopleList
  },
  data: function () {
    return {
      seatingPlan: this.$root.$data.seatingPlan,
      people: this.$root.$data.people
    }
  },
  created: function () {
    this.seatingPlan.seats[1].person = this.people.list['Classic']['Mozart']['Wolfgang Amadeus']
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
