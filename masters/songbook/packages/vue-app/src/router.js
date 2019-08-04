import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home'
import TableOfContents from './views/TableOfContents'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/table-of-contents',
      name: 'toc',
      component: TableOfContents
    }
  ]
})
