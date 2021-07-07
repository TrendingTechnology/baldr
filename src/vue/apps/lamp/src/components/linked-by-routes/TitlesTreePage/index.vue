<template>
  <div
    class="
      vc_titles_tree_page
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <loading-icon v-if="!subTreeList"/>
    <div v-else>
      <titles-bread-crumbs
        v-if="relPath"
        :rel-path="relPath"
      />
      <top-level-jumpers
        :rel-path="relPath"
      />
      <section class="titles" v-if="subTreeList">
        <h1>Themen</h1>
        <tree-title-list
          :list="subTreeList"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import type { TitlesTypes }  from '@bldr/type-definitions'
import type { Route, NavigationGuardNext } from 'vue-router'

import LoadingIcon from '@/components/LoadingIcon.vue'
import TitlesBreadCrumbs from '@/components/TitlesBreadCrumbs.vue'

import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp/titles')

export function toRef (folderName: string): string {
  return folderName.substr(3)
}

// async function enterRoute (vm: TitleTreeContainer, to: Route): Promise<void> {
//   await vm.$store.dispatch('lamp/loadFolderTitleTree')
//   const presentation = vm.$store.getters['lamp/presentation']
//   if (presentation) {
//     const elementLink = document.getElementById(`PREF_${presentation.ref}`)
//     if (elementLink) {
//       elementLink.scrollIntoView({ block: 'center' })
//     }
//   }
// }

@Component({
  computed: mapGetters(['subTreeList']),
  components: {
    LoadingIcon,
    TitlesBreadCrumbs
  }
})
export default class TitlesTreePage extends Vue {
  subTreeList!: TitlesTypes.TreeTitleList

  get relPath (): string | undefined {
    if (this.$route.params.relPath != null) {
      return this.$route.params.relPath
    }
  }

  mounted () {
    this.$store.dispatch('lamp/titles/loadRootTreeList')
  }

  beforeRouteUpdate (to: Route, from: Route, next: NavigationGuardNext<TitlesTreePage>): any {
    this.$store.dispatch('lamp/titles/setSubTreeList', to.params.relPath)
    next()
  }
}
</script>

<style lang="scss">
.vc_titles_tree_page {
  .titles {
    padding: 0 5em;
  }

  .vc_top_level_jumpers {
    padding-left: 2em;
  }

  .vc_titles_bread_crumbs {
    margin: 0.3em;
    font-size: 0.8em;
  }
}
</style>
