<template>
  <div>
    <input type="file" @change="openPresentation"/>
  </div>
</template>

<script>
export default {
  name: 'OpenNewPresentation',
  methods: {
    openPresentation (event) {
      let file = event.target.files[0]
      let reader = new FileReader()
      reader.readAsText(file, 'utf-8')
      reader.onload = readerEvent => {
        let content = readerEvent.target.result
        this.$store.dispatch('openPresentation', content)
        this.$router.push('/slides')
      }
    }
  }
}
</script>
