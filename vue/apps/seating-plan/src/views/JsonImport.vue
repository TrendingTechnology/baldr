<template>
  <main class="vc_json_import">
    <input type="file" @change="readTextFile"/>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class JsonImport extends Vue {
  readTextFile (event: Event) {
    const element = <HTMLInputElement> event!.target
    const file = element!.files![0]
    const reader = new FileReader()
    reader.readAsText(file, 'utf-8')
    reader.onload = readerEvent => {
      const content = readerEvent!.target!.result
      this.$store.dispatch('importState', content)
    }
  }
}
</script>
