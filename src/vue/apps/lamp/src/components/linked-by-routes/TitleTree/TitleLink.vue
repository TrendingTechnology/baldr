<template>
  <span class="vc_presentation_link" :class="classObject">
    <span
      v-if="treeTitle.folder.hasPraesentation"
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

<script>
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('lamp')

export default {
  name: 'TitleLink',
  props: {
    treeTitle: {
      type: Object
    }
  },
  methods: {
    async openPresentation (presRef) {
      this.$router.push({ name: 'slides-preview', params: { presRef: presRef } })
    }
  },
  computed: {
    ...mapGetters(['presentation']),
    presRef: function () {
      return this.treeTitle.folder.folderName.substr(3)
    },
    classObject: function () {
      const result = {}
      result[`level-${this.treeTitle.folder.level}`] = true
      if (
        this.treeTitle.folder.hasPraesentation &&
        this.presentation != null &&
        this.presRef === this.presentation.ref
      ) {
        result.active = true
      }
      return result
    }
  }
}
</script>

<style lang="scss">
  .vc_presentation_link {
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
