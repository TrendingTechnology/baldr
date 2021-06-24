<template>
  <div class="vc_presentation_treeTitle">
    <presentation-link
      :tree-title="treeTitle"
    />
    <ul :class="`ul-level-${level}`" v-if="hasChilds">
      <li
        v-for="treeTitle in childs"
        :key="treeTitle.title.path"
      >
        <presentation-item :treeTitle="treeTitle"/>
      </li>
    </ul>
  </div>
</template>

<script>
import PresentationLink from './PresentationLink.vue'

export default {
  name: 'PresentationItem',
  components: {
    PresentationLink
  },
  props: {
    treeTitle: {
      type: Object
    }
  },
  computed: {
    folderTitle () {
      if (this.treeTitle && this.treeTitle.title) {
        return this.treeTitle.title
      }
      return ''
    },
    title () {
      if (this.folderTitle) {
        return this.folderTitle.title
      } else {
        return ''
      }
    },
    subtitle () {
      if (this.folderTitle && this.folderTitle.subtitle) {
        return this.folderTitle.subtitle
      }
      return ''
    },
    level () {
      if (this.folderTitle && this.folderTitle.level) {
        return this.folderTitle.level
      }
      return 0
    },
    presRef () {
      if (this.folderTitle) {
        return this.folderTitle.folderName.substr(3)
      }
      return ''
    },
    hasPraesentation () {
      if (this.folderTitle) {
        return this.folderTitle.hasPraesentation
      }
      return ''
    },
    hasChilds () {
      return this.treeTitle && this.treeTitle.subTree && Object.keys(this.treeTitle.subTree).length >= 1
    },
    childs () {
      if (!this.treeTitle || !this.treeTitle.subTree) return []
      const treeTitle = []
      const keys = Object.keys(this.treeTitle.subTree).sort()
      for (const key of keys) {
        treeTitle.push(this.treeTitle.subTree[key])
      }
      return treeTitle
    }
  }
}
</script>

<style lang="scss">
  .vc_presentation_treeTitle {
    ul li:before {
      content: '' !important;
    }

    ul {
      padding-left: 2em !important;
    }

    ul.ul-level-1 {
      margin-bottom: 2em;
    }

    .ul-level-1 > li {
      margin-top: 1em;
    }
  }
</style>
