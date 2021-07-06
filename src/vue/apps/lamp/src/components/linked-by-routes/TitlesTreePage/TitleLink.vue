<template>
  <span class="vc_title_link" :class="classAttributes">
    <span
      :id="`PREF_${presRef}`"
      :title="`ID: ${presRef}`"
      @click="openPresentation(presRef)"
      class="title link"
      v-html="folder.title"
      v-if="folder.hasPresentation"
    />
    <router-link
      :to="`/titles/${this.folder.relPath}`"
      class="title"
      v-else
      v-html="folder.title"
    />
    <span v-if="folder.subtitle"> -
      <span class="subtitle" v-html="folder.subtitle"/>
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
  computed: mapGetters(['presentation'])
})
export default class TitleLink extends Vue {
  @Prop()
  folder?: TitlesTypes.FolderTitle

  presentation!: LampTypes.Presentation

  async openPresentation (presRef: string): Promise<void> {
    this.$router.push({
      name: 'slides-preview',
      params: { presRef: presRef }
    })
  }

  get presRef (): string | undefined {
    if (this.folder != null) {
      return this.folder.folderName.substr(3)
    }
  }

  get classAttributes (): ClassAttributeCollection | undefined {
    if (this.folder == null) {
      return
    }
    const result: ClassAttributeCollection = {}
    result[`level-${this.folder.level}`] = true

    if (
      this.folder.hasPresentation &&
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
