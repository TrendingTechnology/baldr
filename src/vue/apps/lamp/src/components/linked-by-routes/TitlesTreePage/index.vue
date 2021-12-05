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
import { TitlesTypes } from '@bldr/type-definitions'
import {
  Component,
  Vue,
  Route,
  NavigationGuardNext,
  createNamespacedHelpers
} from '@bldr/vue-packages-bundler'

import LoadingIcon from '@/components/reusable/LoadingIcon.vue'
import TitlesBreadCrumbs from '@/components/reusable/TitlesBreadCrumbs.vue'

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
  ) {
    next(async vm => {
      await vm.$store.dispatch('lamp/titles/loadRootTreeList')
      vm.$store.dispatch('lamp/titles/setSubTreeList', to.params.relPath)
    })
  }

  beforeRouteUpdate (
    to: Route,
    from: Route,
    next: NavigationGuardNext<TitlesTreePage>
  ): any {
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

  ul {
    li {
      margin-top: 2em;
      font-weight: bold;
      font-family: $font-family-sans;
      font-size: 1.1em;
    }

    ul {
      li {
        margin-top: 1em;
        font-size: 0.9em;
      }

      ul {
        li {
          margin-top: 0.5em;
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
