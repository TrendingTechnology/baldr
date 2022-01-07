/**
 * Set up the class components and register some global components.
 *
 * Must be the first import in `main.ts`
 * @file
 */
import Vue from 'vue'
import Component from 'vue-class-component'

import TitleLink from '@/components/routed/TitlesTreePage/TitleLink.vue'
import TopLevelJumpers from '@/components/routed/TitlesTreePage/TopLevelJumpers.vue'
import TreeTitle from '@/components/routed/TitlesTreePage/TreeTitle.vue'
import TreeTitleList from '@/components/routed/TitlesTreePage/TreeTitleList.vue'

// Register the router hooks with their names
// https://class-component.vuejs.org/guide/additional-hooks.html
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

// To avoid circual dependencies
Vue.component('title-link', TitleLink)
Vue.component('top-level-jumpers', TopLevelJumpers)
Vue.component('tree-title', TreeTitle)
Vue.component('tree-title-list', TreeTitleList)
