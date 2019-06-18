<template>
  <div id="app">
    <CompSeatingPlan :seatingPlan="seatingPlan"/>
    <CompPeopleList :people="people"/>
  </div>
</template>

<script>
import CompSeat from './components/CompSeat.vue'
import CompSeatingPlan from './components/CompSeatingPlan.vue'
import CompPeopleList from './components/CompPeopleList.vue'


export default {
  name: 'app',
  components: {
    CompSeat, CompSeatingPlan, CompPeopleList
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
