<template>
  <div id="app">
    <SeatingPlan :seats="seats"/>
  </div>
</template>

<script>
import Seat from './components/Seat.vue'
import SeatingPlan from './components/SeatingPlan.vue'

let seats = [
  {
    "number": 1,
    "firstName": "Josef",
    "lastName": "Friedrich"
  },
  {
    "number": 2,
    "firstName": "Jörg",
    "lastName": "Fleischner"
  }
]
export default {
  name: 'app',
  components: {
    Seat, SeatingPlan
  },
  data: function () {
    return {
      seats: seats
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
