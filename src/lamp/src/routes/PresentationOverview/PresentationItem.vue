<template>
  <div class="vc_presentation_item">
    <presentation-link
      :hasPraesentation="hasPraesentation"
      :id="id"
      :subtitle="subtitle"
      :title="title"
      :level="level"
    />
    <ul :class="`ul-level-${level}`" v-if="hasChilds">
      <li
        v-for="item in childs"
        :key="item._title.path"
      >
        <presentation-item :item="item"/>
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
    item: {
      type: Object
    }
  },
  computed: {
    folderTitle () {
      if (this.item && '_title' in this.item) {
        return this.item._title
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
    id () {
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
      return this.item && Object.keys(this.item).length > 1
    },
    childs () {
      if (!this.item) return []
      const keys = Object.keys(this.item).filter(key => key !== '_title').sort()
      const item = []
      for (const key of keys) {
        item.push(this.item[key])
      }
      return item
    }
  }
}
</script>

<style lang="scss">
  .vc_presentation_item {
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
