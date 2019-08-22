import Vue from 'vue'
import Router from 'vue-router'
import Home from './views/Home.vue'
import Overview from './views/Overview.vue'
import DocumentCamera from './views/DocumentCamera.vue'
import SlideRenderer from './views/SlideRenderer.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/overview',
      name: 'overview',
      component: Overview
    },
    {
      path: '/document-camera',
      name: 'document-camera',
      component: DocumentCamera
    },
    {
      path: '/examples',
      name: 'examples',
      component: SlideRenderer,
      children: [
        {
          path: 'quote',
          name: 'Master “quote”',
          component: SlideRenderer,
          meta: {
            master: 'quote',
            data: {
              text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.',
              author: 'Johann Wolfgang von Goethe',
              date: 1801
            }
          },
          children: [
            {
              path: 'only-text',
              name: 'Only text',
              component: SlideRenderer,
              meta: {
                master: 'quote',
                data: {
                  text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.'
                }
              }
            }
          ]
        }
      ]
    }
  ]
})
