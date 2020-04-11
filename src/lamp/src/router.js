/**
 * Setup vue router
 *
 * @module @bldr/lamp/router
 */

import Router from 'vue-router'
import store from '@/store.js'
import Vue from 'vue'

// Components.
import AdHocCamera from '@/routes/AdHocCamera.vue'
import AdHocEditor from '@/routes/AdHocEditor.vue'
import CommonExample from '@/routes/CommonExample.vue'
import DocumentationOverview from '@/routes/DocumentationOverview.vue'
import MasterDocumentation from '@/routes/MasterDocumentation.vue'
import MediaIdsParentDir from '@/routes/MediaIdsParentDir'
import OpenInterface from '@/components/OpenInterface'
import PresentationOverview from '@/routes/PresentationOverview/index.vue'
import RemoteControl from '@/routes/RemoteControl.vue'
import RestApiOverview from '@/routes/RestApiOverview.vue'
import SlidesPreview from '@/routes/SlidesPreview/index.vue'
import SlideView from '@/routes/SlideView'
import StartPage from '@/routes/StartPage.vue'

// Failed to load chunks in the subfolder presentation
// const Documentation = () => import(/* webpackChunkName: "documentation" */ '@/routes/Documentation.vue')
// const MasterDocumentation = () => import(/* webpackChunkName: "documentation" */ '@/routes/MasterDocumentation.vue')

// const SlideView = () => import(/* webpackChunkName: "slides" */ '@/routes/SlideView')
// const MasterRenderer = () => import(/* webpackChunkName: "slides" */ '@/routes/SlideView/MasterRenderer.vue')

Vue.use(Router)

const routes = [
  {
    path: '/',
    name: 'home',
    component: StartPage,
    meta: {
      shortcut: 'h',
      title: 'Startseite'
    }
  },
  {
    path: '/open',
    component: OpenInterface,
    name: 'open',
    meta: {
      title: 'Präsentation/Medien-Dateien öffnen'
    }
  },
  {
    path: '/presentation/:presId',
    component: SlidesPreview,
    name: 'slides-preview-short',
    meta: {
      title: 'Überblick über alle Folien'
    }
  },
  {
    path: '/presentation/:presId/preview',
    component: SlidesPreview,
    name: 'slides-preview',
    meta: {
      shortcut: 'o',
      title: 'Überblick über alle Folien'
    }
  },
  {
    path: '/presentation/:presId/slide/:slideNo',
    name: 'slide',
    component: SlideView,
    meta: {
      shortcut: 's',
      title: 'Folien'
    },
    children: [
      {
        path: 'step/:stepNo',
        name: 'slide-step-no',
        component: SlideView
      }
    ]
  },
  {
    path: '/presentation-overview',
    component: PresentationOverview,
    name: 'presentation-overview',
    meta: {
      shortcut: 'p',
      title: 'Überblick über alle Presentation'
    }
  },
  {
    path: '/ad-hoc/camera',
    name: 'camera',
    component: AdHocCamera,
    meta: {
      title: 'Dokumentenkamera',
      shortcut: 'c'
    }
  },
  {
    path: '/ad-hoc/editor',
    name: 'editor',
    component: AdHocEditor,
    meta: {
      title: 'Hefteintrag',
      shortcut: 'e'
    }
  },
  {
    path: '/documentation',
    component: DocumentationOverview,
    name: 'documentation',
    meta: {
      title: 'Dokumentation',
      shortcut: 'd'
    }
  },
  {
    path: '/documentation/common/:exampleName',
    name: 'common-example',
    component: CommonExample,
    meta: {
      title: 'Allgemeines Beispiel'
    }
  },
  {
    path: '/documentation/master/:master',
    name: 'documentation-master',
    component: MasterDocumentation,
    meta: {
      title: 'Master Documentation'
    }
  },
  {
    path: '/rest-api',
    name: 'rest-api',
    component: RestApiOverview,
    meta: {
      shortcut: 'r',
      title: 'Überblick REST-API-Server'
    }
  },
  {
    path: '/media-ids',
    name: 'media-ids',
    component: MediaIdsParentDir,
    meta: {
      shortcut: 'i',
      title: 'Medien-IDs im übergeordneten Ordner'
    }
  },
  {
    path: '/remote-control',
    name: 'remote-control',
    component: RemoteControl
  }
]

const router = new Router({
  routes
})

router.afterEach((to, from) => {
  const slide = store.getters['lamp/slide']
  const presentation = store.getters['lamp/presentation']

  if (slide && slide.title && (to.name === 'slide' || to.name === 'slide-step-no')) {
    document.title = `${presentation.title}: Folie Nr. ${slide.no} ${slide.title}`
  } else if (to.meta && to.meta.title) {
    document.title = to.meta.title
  } else {
    document.title = 'Lamp'
  }
})

export default router
