<template>
  <div class="import-data">
    <heading-title title="Daten importieren"/>
    <input type="file" @change="eventListenerChange"/>
  </div>
</template>

<script>
import dataStore from '../data-store.js'
import HeadingTitle from './HeadingTitle'

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
        dataStore.importData(content)
        console.log(dataStore.getData())
      }
    }
  }
}
</script>
