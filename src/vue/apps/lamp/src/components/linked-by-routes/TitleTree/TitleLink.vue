<template>
  <span class="vc_title_link" :class="classAttributes">
    <span
      :id="`PREF_${presRef}`"
      :title="`ID: ${presRef}`"
      @click="openPresentation(presRef)"
      class="title link"
      v-html="treeTitle.folder.title"
      v-if="treeTitle.folder.hasPresentation"
    />
    <router-link
      :to="`/topics/${this.treeTitle.folder.relPath}`"
      class="title"
      v-else
      v-html="treeTitle.folder.title"
    />
    <span v-if="treeTitle.folder.subtitle"> -
      <span class="subtitle" v-html="treeTitle.folder.subtitle"/>
    </span>
  </span>
</template>

<script lang="ts">
import type { TitlesTypes, LampTypes } from '@bldr/type-definitions'

import { Vue, Component, Prop } from 'vue-property-decorator'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

interface ClassAttributeCollection {
  [className: string]: boolean
}

@Component({
  computed: mapGetters(['presentation']),
  components: {
    TitleLink
  }
})
export default class TitleLink extends Vue {
  @Prop()
  treeTitle?: TitlesTypes.TreeTitle

  presentation!: LampTypes.Presentation

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

    if (
      this.treeTitle.folder.hasPresentation &&
      this.presentation != null &&
      this.presRef === this.presentation.ref
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
