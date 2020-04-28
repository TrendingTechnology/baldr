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
      const file = event.target.files[0]
      const reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = readerEvent => {
        const content = readerEvent.target.result
        this.$store.dispatch('importState', content)
      }
    }
  }
}
</script>
