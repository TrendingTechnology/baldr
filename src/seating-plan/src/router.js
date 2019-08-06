import Vue from 'vue'
import Router from 'vue-router'

// Page components
import JobsManager from '@/pages/JobsManager'
import JsonImport from '@/pages/JsonImport'
import AdministerPersons from '@/pages/AdministerPersons'
import SeatingPlan from '@/pages/SeatingPlan'
import SpreadsheetImport from '@/pages/SpreadsheetImport'
import StartPage from '@/pages/StartPage'
import TimeTravel from '@/pages/TimeTravel'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'start-page',
      path: '/',
      component: StartPage,
      meta: {
        title: 'Sitzpläne Musiksaal E 17'
      }
    },
    {
      name: 'seating-plan',
      path: '/grade/:grade',
      component: SeatingPlan
    },
    {
      name: 'administer-persons',
      path: '/grade/:grade/administer-persons',
      component: AdministerPersons
    },
    {
      name: 'spreadsheet-import',
      path: '/spreadsheet-import',
      component: SpreadsheetImport,
      meta: {
        title: 'Aus Excel / Calc importieren'
      }
    },
    {
      name: 'json-import',
      path: '/json-import',
      component: JsonImport,
      meta: {
        title: 'JSON-Dump importieren'
      }
    },
    {
      name: 'time-travel',
      path: '/time-travel',
      component: TimeTravel,
      meta: {
        title: 'Zeitreise'
      }
    },
    {
      name: 'jobs-manager',
      path: '/jobs-manager',
      component: JobsManager,
      meta: {
        title: 'Dienste verwalten'
      }
    }
  ]
})
