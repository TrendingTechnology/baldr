<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router'
import SeatingPlanView from './components/SeatingPlanView.vue'
import StartPage from './components/StartPage.vue'
import TestData from './components/TestData.vue'
import ImportPersons from './components/ImportPersons.vue'
import ExportData from './components/ExportData.vue'
import ImportData from './components/ImportData.vue'
import JobsManager from './components/JobsManager.vue'

import '@bldr/theme-default-css'

const routes = [
  { path: '/', component: StartPage },
  { path: '/grade/:grade', component: SeatingPlanView },
  { path: '/import-persons', component: ImportPersons },
  { path: '/export-data', component: ExportData },
  { path: '/import-data', component: ImportData },
  { path: '/jobs-manager', component: JobsManager },
  { path: '/test-data', component: TestData }
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
  font-size: 1.2vw;
}

</style>
