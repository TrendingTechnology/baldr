<template>
  <span class="vc_title_link" :class="classAttributes">
    <span
      v-if="treeTitle.folder.hasPresentation"
      class="title link"
      :id="`PREF_${presRef}`"
      @click="openPresentation(presRef)"
      :title="`ID: ${presRef}`"
      v-html="treeTitle.folder.title"
    />
    <router-link
      class="title"
      :to="`/topics/${this.treeTitle.folder.relPath}`"
      v-else
      v-html="treeTitle.folder.title"
    />
    <span v-if="treeTitle.folder.subtitle"> -
      <span class="subtitle" v-html="treeTitle.folder.subtitle"/>
    </span>
  </span>
</template>

<script lang="ts">
import type { TitlesTypes } from '@bldr/type-definitions'

import { Vue, Component, Prop } from 'vue-property-decorator'
import store from '@/store/index.js'

interface ClassAttributeCollection {
  [className: string]: boolean
}

@Component({
  components: {
    TitleLink
  }
})
export default class TitleLink extends Vue {
  @Prop()
  treeTitle?: TitlesTypes.TreeTitle

  async openPresentation (presRef: string): Promise<void> {
    this.$router.push({
      name: 'slides-preview',
      params: { presRef: presRef }
    })
  }

  get presRef (): string | undefined {
    if (this.treeTitle != null) {
      return this.treeTitle.folder.folderName.substr(3)
    }
  }

  get classAttributes (): ClassAttributeCollection | undefined {
    if (this.treeTitle == null) {
      return
    }
    const result: ClassAttributeCollection = {}
    result[`level-${this.treeTitle.folder.level}`] = true

    const presentation = store.getters['lamp/presentation']

    if (
      this.treeTitle.folder.hasPresentation &&
      presentation != null &&
      this.presRef === presentation.ref
    ) {
      result.active = true
    }
    return result
  }
}
</script>

<style lang="scss">
.vc_title_link {
  &.level-1 .title {
    font-family: $font-family-sans;
    font-size: 1.6em;
    font-weight: bold;
  }

  &.level-2 .title {
    font-family: $font-family-sans;
    font-weight: bold;
    font-size: 1.4em;
  }

  &.level-3 .title {
    font-family: $font-family-sans;
    font-size: 1.2em;
  }
}
</style>
