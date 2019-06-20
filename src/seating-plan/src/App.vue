<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import SeatingPlanView from './components/SeatingPlanView.vue'
import GradesList from './components/GradesList.vue'

const routes = [
  { path: '/grades-list', component: GradesList },
  { path: '/grade/:grade', component: SeatingPlanView }
]

const router = new VueRouter({routes})

export default {
  name: 'app',
  router
}
</script>

<style>
body {
  margin: 2px;
}

</style>
