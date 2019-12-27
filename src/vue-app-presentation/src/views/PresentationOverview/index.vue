<template>
  <div class="vc_presentation_overview default-padding" b-content-theme="default">
    <h1>Überblick über alle Präsentationen</h1>
    <ul>
      <presentation-item :item="tree"/>
    </ul>
  </div>
</template>

<script>
import PresentationItem from './PresentationItem.vue'
export default {
  name: 'PresentationOverview',
  components: {
    PresentationItem
  },
  data () {
    return {
      tree: null
    }
  },
  async mounted () {
    const response = await this.$media.httpRequest.request('get/folder-title-tree')
    this.tree = response.data
    console.log(this.tree)
  }
}
</script>
