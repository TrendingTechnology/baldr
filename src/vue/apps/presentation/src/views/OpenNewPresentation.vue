<template>
  <div>
    <input type="file" @change="readTextFile"/>
  </div>
</template>

<script>
export default {
  name: 'OpenNewPresentation',
  methods: {
    readTextFile (event) {
      let file = event.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = readerEvent => {
        let content = readerEvent.target.result
        this.$store.dispatch('openPresentation', content)
      }
    }
  }
}
</script>
