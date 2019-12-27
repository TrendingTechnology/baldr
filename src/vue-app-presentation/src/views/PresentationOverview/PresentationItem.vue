<template>
  <li class="vc_presentation_item">
    <span v-if="hasChilds">{{ title }}</span>
    <presentation-link v-else :title="title" :id="id"/>
    <ul v-if="hasChilds">
      <presentation-item
        :item="item"
        v-for="item in childs"
        :key="item._title.title"
      />
    </ul>
  </li>
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
    title () {
      if (this.item && '_title' in this.item) {
        return this.item._title.title
      } else {
        return '…'
      }
    },
    id () {
      if (this.item && '_title' in this.item) {
        return this.item._title.folderName.substr(3)
      }
    },
    hasChilds () {
      return this.item && Object.keys(this.item).length > 1
    },
    childs () {
      if (!this.item) return []
      const keys = Object.keys(this.item).filter(key => key !== '_title').sort()
      let item = []
      for (const key of keys) {
        item.push(this.item[key])
      }
      return item
    }
  }
}
</script>
