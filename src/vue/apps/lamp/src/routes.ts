/**
 * Setup vue router and define the routes.
 *
 * @module @bldr/lamp/routes
 */

import Router, { RouteConfig } from 'vue-router'
import Vue from 'vue'
import { installDocumentTitleUpdater } from '@/routing.js'

// Components.
import AboutPage from '@/components/linked-by-routes/AboutPage.vue'
import AdHocCamera from '@/routes/AdHocCamera.vue'
import AdHocEditor from '@/routes/AdHocEditor.vue'

import DocumentationOverview from '@/components/linked-by-routes/Documentation/index.vue'
import CommonExample from '@/components/linked-by-routes/Documentation/CommonExample.vue'
import MasterDocumentation from '@/components/linked-by-routes/Documentation/MasterDocumentation.vue'

import OpenInterface from '@/components/OpenInterface/index.vue'

import SlidesPreview from '@/routes/SlidesPreview/index.vue'
import SlideView from '@/routes/SlideView/index.vue'
import SpeakerView from '@/routes/SpeakerView/index.vue'
import StartPage from '@/components/linked-by-routes/StartPage.vue'
import TitleTree from '@/components/linked-by-routes/TitleTree/index.vue'
import TexMarkdownConverter from '@/components/linked-by-routes/TexMarkdownConverter.vue'

Vue.use(Router)

const routes: RouteConfig[] = [
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
    path: '/presentation/:presRef',
    component: SlidesPreview,
    name: 'slides-preview-short',
    meta: {
      title: 'Überblick über alle Folien'
    }
  },
  {
    path: '/presentation/:presRef/preview',
    component: SlidesPreview,
    name: 'slides-preview',
    meta: {
      shortcut: 'o',
      title: 'Überblick über alle Folien'
    }
  },
  {
    path: '/presentation/:presRef/slide/:slideNo',
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
    path: '/speaker-view/:presRef/slide/:slideNo',
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
    component: TitleTree,
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
    path: '/about',
    name: 'about',
    component: AboutPage,
    meta: {
      title: 'Über BALDR Lamp'
    }
  },
  {
    path: '/tex-markdown-converter',
    name: 'tex-markdown-converter',
    component: TexMarkdownConverter,
    meta: {
      title: 'TeX-Markdown-Konvertierung'
    }
  }
]

export const router = new Router({
  routes
})

installDocumentTitleUpdater(router)

export default router
