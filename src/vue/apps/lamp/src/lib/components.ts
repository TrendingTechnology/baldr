/**
 * Set up the class components and register some global components.
 *
 * Must be the first import in `main.ts`
 * @file
 */
import Vue from 'vue'
import Component from 'vue-class-component'

// Register the router hooks with their names
// https://class-component.vuejs.org/guide/additional-hooks.html
Component.registerHooks([
  'beforeRouteEnter',
  'beforeRouteLeave',
  'beforeRouteUpdate'
])

// To avoid circual dependencies
import TitleLink from '@/components/linked-by-routes/TitlesTreePage/TitleLink.vue'
import TopLevelJumpers from '@/components/linked-by-routes/TitlesTreePage/TopLevelJumpers.vue'
import TreeTitle from '@/components/linked-by-routes/TitlesTreePage/TreeTitle.vue'
import TreeTitleList from '@/components/linked-by-routes/TitlesTreePage/TreeTitleList.vue'

Vue.component('title-link', TitleLink)
Vue.component('top-level-jumpers', TopLevelJumpers)
Vue.component('tree-title', TreeTitle)
Vue.component('tree-title-list', TreeTitleList)
