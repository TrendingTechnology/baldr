import Vue from 'vue'

// To avoid circual dependencies
import TitleLink from '@/components/linked-by-routes/TitlesTreePage/TitleLink.vue'
import TopLevelJumpers from '@/components/linked-by-routes/TitlesTreePage/TopLevelJumpers.vue'
import TreeTitle from '@/components/linked-by-routes/TitlesTreePage/TreeTitle.vue'
import TreeTitleList from '@/components/linked-by-routes/TitlesTreePage/TreeTitleList.vue'

Vue.component('title-link', TitleLink)
Vue.component('top-level-jumpers', TopLevelJumpers)
Vue.component('tree-title', TreeTitle)
Vue.component('tree-title-list', TreeTitleList)
