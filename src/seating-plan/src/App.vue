<template>
  <div id="app">
    <heading-title :title="title"/>
    <router-view></router-view>
  </div>
</template>

<script>
import VueRouter from 'vue-router'

// Components
import ImportData from './components/ImportData.vue'
import TimeTravel from '@/pages/TimeTravel'
import ImportPersons from './components/ImportPersons.vue'
import JobsManager from './components/JobsManager.vue'
import SeatingPlanView from './components/SeatingPlanView.vue'
import StartPage from './components/StartPage.vue'
import HeadingTitle from '@/components/HeadingTitle'

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
    component: SeatingPlanView
  },
  {
    path: '/import-persons',
    component: ImportPersons,
    meta: {
      title: 'SchülerInnen importieren'
    }
  },
  {
    path: '/import-data',
    component: ImportData,
    meta: {
      title: 'Daten importieren'
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
    HeadingTitle
  },
  router,
  computed: {
    title () {
      if (this.$route.params.grade) {
        return `Sitzplan der Klasse “${this.$route.params.grade}”`
      } else if (this.$route.meta.title) {
        return this.$route.meta.title
      } else {
        return 'Sitzpläne Musiksaal E 17'
      }
    }
  },
  created: function () {
    this.$store.dispatch('importLatestState')
    window.addEventListener('beforeunload', event => {
      event.preventDefault()
      event.returnValue = ''
    })
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
