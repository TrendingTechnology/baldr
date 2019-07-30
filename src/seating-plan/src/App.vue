<template>
  <div id="app">
    <app-header :title="title"/>
    <router-view></router-view>
    <app-footer/>
  </div>
</template>

<script>
import VueRouter from 'vue-router'

// Components
import AppHeader from '@/components/layout/AppHeader'
import AppFooter from '@/components/layout/AppFooter'

// Page components
import JobsManager from '@/pages/JobsManager'
import JsonImport from '@/pages/JsonImport'
import SeatingPlan from '@/pages/SeatingPlan'
import SpreadsheetImport from '@/pages/SpreadsheetImport'
import StartPage from '@/pages/StartPage'
import TimeTravel from '@/pages/TimeTravel'

import '@bldr/theme-default-css'

const routes = [
  {
    path: '/',
    component: StartPage,
    meta: {
      title: 'Sitzpläne Musiksaal E 17'
    }
  },
  {
    path: '/grade/:grade',
    component: SeatingPlan
  },
  {
    path: '/spreadsheet-import',
    component: SpreadsheetImport,
    meta: {
      title: 'Aus Excel / Calc importieren'
    }
  },
  {
    path: '/json-import',
    component: JsonImport,
    meta: {
      title: 'JSON-Dump importieren'
    }
  },
  {
    path: '/time-travel',
    component: TimeTravel,
    meta: {
      title: 'Zeitreise'
    }
  },
  {
    path: '/jobs-manager',
    component: JobsManager,
    meta: {
      title: 'Dienste verwalten'
    }
  }
]

const router = new VueRouter({ routes })

export default {
  name: 'app',
  components: {
    AppHeader,
    AppFooter
  },
  router,
  computed: {
    title () {
      if (this.$route.meta.title) {
        return this.$route.meta.title
      }
      return null
    }
  },
  created: function () {
    this.$store.dispatch('importLatestState')

    window.addEventListener('beforeunload', event => {
      event.preventDefault()
      event.returnValue = ''
    })

    this.$store.dispatch('checkApi')
  }
}
</script>

<style>
  @import '~@bldr/theme-default-css/styles.css';

  body {
    margin: 2px;
    font-size: 1.2vw;
  }

  @page {
    size: A4 landscape;
    margin: 2em;
  }
</style>
