<template>
  <div
    class="vc_titles_tree_page main-app-fullscreen"
    b-content-theme="default"
  >
    <loading-icon v-if="!subTreeList" />
    <div v-else>
      <titles-bread-crumbs v-if="relPath" :rel-path="relPath" />
      <top-level-jumpers :rel-path="relPath" />
      <section class="titles" v-if="subTreeList">
        <h1 v-html="titleOfRelPath" />
        <tree-title-list :list="subTreeList" />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { createNamespacedHelpers } from 'vuex'
import { Route, NavigationGuardNext } from 'vue-router'

import { TitlesTypes } from '@bldr/type-definitions'

import LoadingIcon from '@/components/reusable/LoadingIcon.vue'
import TitlesBreadCrumbs from '@/components/reusable/TitlesBreadCrumbs.vue'
import Vm from '../../../main'

const { mapGetters } = createNamespacedHelpers('presentation/titles')

export function toRef (folderName: string): string {
  return folderName.substr(3)
}

// async function enterRoute (vm: TitleTreeContainer, to: Route): Promise<void> {
//   await vm.$store.dispatch('presentation/loadFolderTitleTree')
//   const presentation = vm.$store.getters['presentation/presentation']
//   if (presentation) {
//     const elementLink = document.getElementById(`PREF_${presentation.ref}`)
//     if (elementLink) {
//       elementLink.scrollIntoView({ block: 'center' })
//     }
//   }
// }

@Component({
  computed: mapGetters(['subTreeList', 'titleOfRelPath']),
  components: {
    LoadingIcon,
    TitlesBreadCrumbs
  }
})
export default class TitlesTreePage extends Vue {
  subTreeList!: TitlesTypes.TreeTitleList

  titleOfRelPath!: string

  get relPath (): string | undefined {
    if (this.$route.params.relPath != null) {
      return this.$route.params.relPath
    }
  }

  beforeRouteEnter (
    to: Route,
    from: Route,
    next: NavigationGuardNext<TitlesTreePage>
  ): void {
    next(async (vm: typeof Vm) => {
      await vm.$store.dispatch('presentation/titles/loadRootTreeList')
      vm.$store.dispatch('presentation/titles/setSubTreeList', to.params.relPath)
    })
  }

  beforeRouteUpdate (
    to: Route,
    from: Route,
    next: NavigationGuardNext<TitlesTreePage>
  ): void {
    this.$store.dispatch('presentation/titles/setSubTreeList', to.params.relPath)
    next()
  }
}
</script>

<style lang="scss">
.vc_titles_tree_page {
  font-size: 1.7em;

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

  ul {
    li {
      margin-top: 1.4em;
      font-weight: bold;
      font-family: $font-family-sans;
      font-size: 1.1em;
    }

    ul {
      li {
        margin-top: 0.7em;
        font-size: 0.9em;
      }

      ul {
        li {
          margin-top: 0.2em;
          font-weight: normal;
          font-family: $font-family-serif;
        }

        ul {
          li {
            margin-top: 0em;
          }
        }
      }
    }
  }
}
</style>
