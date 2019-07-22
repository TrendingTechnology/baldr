<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router'

// Components
import ImportData from './components/ImportData.vue'
import ImportFromCloud from './components/ImportFromCloud.vue'
import ImportPersons from './components/ImportPersons.vue'
import JobsManager from './components/JobsManager.vue'
import SeatingPlanView from './components/SeatingPlanView.vue'
import StartPage from './components/StartPage.vue'

import '@bldr/theme-default-css'

const routes = [
  {
    path: '/',
    component: StartPage
  },
  {
    path: '/grade/:grade',
    component: SeatingPlanView
  },
  {
    path: '/import-persons',
    component: ImportPersons
  },
  {
    path: '/import-data',
    component: ImportData
  },
  {
    path: '/import-from-cloud',
    component: ImportFromCloud
  },
  {
    path: '/jobs-manager',
    component: JobsManager
  }
]

const router = new VueRouter({ routes })

export default {
  name: 'app',
  router,
  created: function () {
    const state = localStorage.getItem('state')
    if (state) {
      this.$store.dispatch('importState', state)
    }
  }
}
</script>

<style>
  @import '../node_modules/@bldr/theme-default-css/styles.css';

  body {
    margin: 2px;
    font-size: 1.2vw;
  }

  @page {
    size: A4 landscape;
    margin: 2em;
  }
</style>
