<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import SeatingPlanView from './components/SeatingPlanView.vue'
import GradesList from './components/GradesList.vue'
import ImportPersons from './components/ImportPersons.vue'
import ExportData from './components/ExportData.vue'

import '@bldr/theme-default-css'

const routes = [
  { path: '/grades-list', component: GradesList, alias: '/' },
  { path: '/grade/:grade', component: SeatingPlanView },
  { path: '/import-persons', component: ImportPersons },
  { path: '/export-data', component: ExportData }
]

const router = new VueRouter({ routes })

export default {
  name: 'app',
  router
}
</script>

<style>
@import '../node_modules/@bldr/theme-default-css/styles.css';

body {
  margin: 2px;
}

</style>
