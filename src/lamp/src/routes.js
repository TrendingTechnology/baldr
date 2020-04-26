/**
 * Setup vue router and define the routes.
 *
 * @module @bldr/lamp/routes
 */

import Router from 'vue-router'
import Vue from 'vue'
import { installDocumentTitleUpdater } from '@/routing.js'

// Components.
import AdHocCamera from '@/routes/AdHocCamera.vue'
import AdHocEditor from '@/routes/AdHocEditor.vue'
import CommonExample from '@/routes/CommonExample.vue'
import DocumentationOverview from '@/routes/DocumentationOverview.vue'
import MasterDocumentation from '@/routes/MasterDocumentation.vue'
import MediaIdsParentDir from '@/routes/MediaIdsParentDir'
import OpenInterface from '@/components/OpenInterface'
import TopicsTree from '@/routes/TopicsTree/index.vue'
import SpeakerView from '@/routes/SpeakerView/index.vue'
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
    path: '/speaker-view/:presId/slide/:slideNo',
    name: 'speaker-view',
    component: SpeakerView,
    meta: {
      title: 'Referentenansicht'
    },
    children: [
      {
        path: 'step/:stepNo',
        name: 'speaker-view-step-no',
        component: SpeakerView
      }
    ]
  },
  {
    path: '/topics/:ids*',
    component: TopicsTree,
    name: 'topics',
    meta: {
      shortcut: 'p',
      title: 'Themen'
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
  }
]

export const router = new Router({
  routes
})

installDocumentTitleUpdater(router)

/**
 *
 */
export const views = {
  public: {
    slideNo: 'slide',
    stepNo: 'slide-step-no'
  },
  speaker: {
    slideNo: 'speaker-view',
    stepNo: 'speaker-view-step-no'
  }
}

/**
 * @returns {module:@bldr/lamp/routing~view}
 */
export function getViewFromRoute () {
  const name = router.currentRoute.name
  if (name === 'speaker-view' || name === 'speaker-view-step-no') {
    return 'speaker'
  }
  return 'public'
}

export default router
