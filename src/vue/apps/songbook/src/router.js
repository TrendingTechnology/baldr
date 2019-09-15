import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'

import TableOfContents from './views/TableOfContents'
import SongView from './views/SongView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      shortcut: 'h',
      component: Home
    },
    {
      path: '/song/:songID',
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
