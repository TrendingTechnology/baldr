<template>
  <li class="vc_presentation_item">
    <presentation-link
      :hasChilds="hasChilds"
      :id="id"
      :subtitle="subtitle"
      :title="title"
    />
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
    subtitle () {
      console.log(this.item._title)
      if (this.item && '_title' in this.item && this.item._title.subtitle) {
        return this.item._title.subtitle
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
