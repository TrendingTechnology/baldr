import { VueRouter, Vue } from '@bldr/vue-packages-bundler'

// Components.
import StartPage from './views/StartPage'
import TableOfContents from './views/TableOfContents'
import SongView from './views/SongView'

Vue.use(VueRouter)

export default new VueRouter({
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
