/**
 * Setup vue router and define the routes.
 *
 * @module @bldr/lamp/routes
 */

import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

import { installDocumentTitleUpdater } from './routing-related'

// Components.
import AboutPage from '@/components/routed/AboutPage.vue'
import AdHocCamera from '@/components/routed/AdHocCamera.vue'
import AdHocEditor from '@/components/routed/AdHocEditor.vue'

// Documentation
import DocumentationOverview from '@/components/routed/Documentation/index.vue'
import CommonExample from '@/components/routed/Documentation/CommonExample.vue'
import MasterDocumentation from '@/components/routed/Documentation/MasterDocumentation.vue'

import SlidesPreview from '@/components/routed/SlidesPreview/index.vue'
import SlideView from '@/components/routed/SlideView.vue'
import SpeakerView from '@/components/routed/SpeakerView/index.vue'
import StartPage from '@/components/routed/StartPage.vue'
import TitlesTreePage from '@/components/routed/TitlesTreePage/index.vue'
import TexMarkdownConverter from '@/components/routed/TexMarkdownConverter.vue'
import MediaCategories from '@/components/routed/MediaCategories/index.vue'

Vue.use(VueRouter)

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
    path: '/titles/:relPath*',
    component: TitlesTreePage,
    name: 'titles',
    meta: {
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
  },
  {
    path: '/media-categories',
    name: 'media-categories',
    meta: {
      title: 'Medien Metadaten-Kategorien'
    },
    component: MediaCategories
  }
]

export const router = new VueRouter({
  mode: 'history',
  routes
})

installDocumentTitleUpdater(router)

export default router
