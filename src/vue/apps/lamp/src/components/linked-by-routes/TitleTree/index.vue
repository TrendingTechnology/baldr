<template>
  <div
    class="
      vc_title_tree_container
      main-app-fullscreen
    "
    b-content-theme="default"
  >
    <loading-icon v-if="!list"/>
    <div v-else>
      <topic-bread-crumbs
        v-if="relPath"
        :path="relPath"
      />
      <top-level-jumpers
        :path="relPath"
      />
      <section class="topics">
        <h1>Themen</h1>
        <tree-title-list
          :list="list"
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
import TreeTitleList from './TreeTitleList.vue'
import TopicBreadCrumbs from '@/components/TopicBreadCrumbs.vue'
import TopLevelJumpers from './TopLevelJumpers.vue'

export function toRef (folderName: string): string {
  return folderName.substr(3)
}

async function enterRoute (vm: TitleTreeContainer, to: Route): Promise<void> {
  await vm.$store.dispatch('lamp/loadFolderTitleTree')
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
    TreeTitleList,
    TopLevelJumpers,
    TopicBreadCrumbs
  }
})
export default class TitleTreeContainer extends Vue {

  get relPath (): string | undefined {
    if (this.$route.params.ids != null) {
      return this.$route.params.ids
    }
  }

  get rootList (): TitlesTypes.TreeTitleList {
    const sub = this.$store.getters['lamp/folderTitleTree'] as TitlesTypes.TreeTitleList
    return {
      '/': {
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
  }

  get list (): TitlesTypes.TreeTitleList | null {
    if (this.relPath == null || this.relPath === 'Musik') {
      return this.rootList
    }
    const folderNames = this.relPath.split('/')
    let list = this.rootList
    for (const folderName of folderNames) {
      if (list != null && list.sub) {
        list = list[folderName].sub
      }
    }
    return list
  }

  beforeRouteEnter (to: Route, from: Route, next: NavigationGuardNext<TitleTreeContainer>): any {
    next(vm => {
      enterRoute(vm, to)
    })
  }
}
</script>

<style lang="scss">
  .vc_title_tree_container {
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
