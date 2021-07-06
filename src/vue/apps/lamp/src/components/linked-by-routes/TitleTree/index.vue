<template>
  <div
    class="
      vc_topics_tree
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <loading-icon v-if="!folderTitleTree"/>
    <div v-else>
      <topic-bread-crumbs
        v-if="path"
        :path="path"
      />
      <top-level-jumpers
        :path="path"
      />
      <section class="topics">
        <h1>Themen</h1>
        <folder-title
          v-if="subFolderTitleTree"
          :tree-title="subFolderTitleTree"
        />
        <folder-title
          v-else
          :tree-title="folderTitleTree"
        />
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

import type { TitlesTypes }  from '@bldr/type-definitions'
import type { Route, NavigationGuardNext } from 'vue-router'
import LoadingIcon from '@/components/LoadingIcon.vue'
import FolderTitle from './FolderTitle.vue'
import TopicBreadCrumbs from '@/components/TopicBreadCrumbs.vue'
import TopLevelJumpers from './TopLevelJumpers.vue'

export function toRef (folderName: string): string {
  return folderName.substr(3)
}

async function enterRoute (vm: TitleTree, to: Route): Promise<void> {
  await vm.$store.dispatch('lamp/loadFolderTitleTree')
  vm.setSubFolderTitleTreeByIds(to.params.ids)
  const presentation = vm.$store.getters['lamp/presentation']
  if (presentation) {
    const elementLink = document.getElementById(`PREF_${presentation.ref}`)
    if (elementLink) {
      elementLink.scrollIntoView({ block: 'center' })
    }
  }
}

@Component({
  components: {
    LoadingIcon,
    FolderTitle,
    TopLevelJumpers,
    TopicBreadCrumbs
  }
})
export default class TitleTree extends Vue {
  subFolderTitleTree?: TitlesTypes.TreeTitleList
  path?: string

  setSubFolderTitleTreeByIds (relPath?: string): void {
    if (relPath == null) {
      return
    }
    if (relPath === 'Musik') {
      this.subFolderTitleTree = undefined
      return
    }
    const folderNames = relPath.split('/')
    let tree = this.folderTitleTree
    for (const folderName of folderNames) {
      if (tree && tree.sub) {
        tree = tree.sub[folderName]
      }
    }
    this.subFolderTitleTree = tree.sub
  }

  mounted () {
    this.path = this.$route.params.ids
  }

  get folderTitleTree (): TitlesTypes.TreeTitle {
    const sub = this.$store.getters['lamp/folderTitleTree'] as TitlesTypes.TreeTitleList
    return {
      sub,
      folder: {
        title: 'Fach Musik',
        level: 0,
        hasPresentation: false,
        relPath: '/',
        folderName: 'musik'
      }
    }
  }

  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext<TitleTree>): any {
    next(vm => {
      enterRoute(vm, to)
    })
  }

  beforeRouteUpdate (to: Route, from: Route, next: NavigationGuardNext<TitleTree>): any {
    enterRoute(this, to)
    this.path = to.params.ids
    next()
  }
}
</script>

<style lang="scss">
  .vc_topics_tree {
    .topics {
      padding: 0 5em;
    }

    .vc_top_level_jumpers {
      padding-left: 2em;
    }

    .vc_topic_bread_crumbs {
      margin: 0.3em;
      font-size: 0.8em;
    }
  }
</style>
