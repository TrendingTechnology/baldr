import Vue from 'vue'
import Router from 'vue-router'

// Components.
import StartPage from './views/StartPage'
import TableOfContents from './views/TableOfContents'
import SongView from './views/SongView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      shortcut: 'h',
      component: StartPage
    },
    {
      path: '/song/:songId',
      name: 'song',
      component: SongView
    },
    {
      path: '/table-of-contents',
      shortcut: 't',
      name: 'toc',
      component: TableOfContents
    }
  ]
})
