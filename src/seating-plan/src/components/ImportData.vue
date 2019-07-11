<template>
  <div class="import-data">
    <heading-title title="Daten importieren"/>
    <input type="file" @change="eventListenerChange"/>
  </div>
</template>

<script>
// Components
import HeadingTitle from './HeadingTitle.vue'

export default {
  name: 'ImportData',
  components: {
    HeadingTitle
  },
  methods: {
    eventListenerChange (event) {
      let file = event.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = readerEvent => {
        let content = readerEvent.target.result
        this.$store.dispatch('importState', content)
      }
    }
  }
}
</script>
