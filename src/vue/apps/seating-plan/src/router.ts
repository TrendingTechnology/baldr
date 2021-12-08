import { Vue, VueRouter } from '@bldr/vue-packages-bundler'

// Page components
import JobsManager from '@/views/JobsManager.vue'
import JsonImport from '@/views/JsonImport.vue'
import AdministerPersons from '@/views/AdministerPersons/index.vue'
import SeatingPlan from '@/views/SeatingPlan/index.vue'
import SpreadsheetImport from '@/views/SpreadsheetImport.vue'
import StartPage from '@/views/StartPage/index.vue'
import TimeTravel from '@/views/TimeTravel.vue'

Vue.use(VueRouter)

export default new VueRouter({
  routes: [
    {
      name: 'start-page',
      path: '/',
      component: StartPage,
      // shortcut: 'h',
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
      // shortcut: 's',
      component: SpreadsheetImport,
      meta: {
        title: 'Aus Excel / Calc importieren'
      }
    },
    {
      name: 'json-import',
      path: '/json-import',
      // shortcut: 'j',
      component: JsonImport,
      meta: {
        title: 'JSON-Dump importieren'
      }
    },
    {
      name: 'time-travel',
      path: '/time-travel',
      // shortcut: 't',
      component: TimeTravel,
      meta: {
        title: 'Zeitreise'
      }
    },
    {
      name: 'jobs-manager',
      path: '/jobs-manager',
      // shortcut: 'm',
      component: JobsManager,
      meta: {
        title: 'Dienste verwalten'
      }
    }
  ]
})
