<template>
  <div class="vc_presentation_treeTitle">
    <presentation-link
      :tree-title="treeTitle"
    />
    <ul
      :class="`ul-level-${treeTitle.folder.level}`"
      v-if="hasChilds"
    >
      <li
        v-for="treeTitle in childs"
        :key="treeTitle.folder.path"
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
    hasChilds () {
      return (
        this.treeTitle != null &&
        this.treeTitle.sub != null &&
        Object.keys(this.treeTitle.sub).length >= 1
      )
    },
    childs () {
      if (this.treeTitle == null || this.treeTitle.sub == null) {
        return []
      }
      const treeTitles = []
      const keys = Object.keys(this.treeTitle.sub).sort()
      for (const key of keys) {
        treeTitles.push(this.treeTitle.sub[key])
      }
      return treeTitles
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
