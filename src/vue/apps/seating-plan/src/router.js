import Vue from 'vue'
import Router from 'vue-router'

// Page components
import JobsManager from '@/views/JobsManager'
import JsonImport from '@/views/JsonImport'
import AdministerPersons from '@/views/AdministerPersons'
import SeatingPlan from '@/views/SeatingPlan'
import SpreadsheetImport from '@/views/SpreadsheetImport'
import StartPage from '@/views/StartPage'
import TimeTravel from '@/views/TimeTravel'

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
