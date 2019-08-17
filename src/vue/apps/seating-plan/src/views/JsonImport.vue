<template>
  <main>
    <input type="file" @change="readTextFile"/>
  </main>
</template>

<script>
export default {
  name: 'JsonImport',
  methods: {
    readTextFile (event) {
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
