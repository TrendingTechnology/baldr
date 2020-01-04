<template>
  <div class="vc_quote_master_preview">
    <p class="text">
      <span class="quotation-mark">»</span>
      <span v-html="text"/>
      <span class="quotation-mark">«</span>
    </p>
    <p class="attribution" v-if="author || date">
      <span class="author" v-if="author">{{ author }}</span>
      <span v-if="author && date">, </span>
      <span class="date" v-if="date">{{ date }}</span>
      <span class="source" v-if="source" v-html="` - aus: ${this.source}`"/>
    </p>
  </div>
</template>

<script>

export default {
  props: {
    text: {
      type: String,
      required: true,
      markup: true,
      description: 'Haupttext des Zitats.'
    },
    author: {
      type: String,
      description: 'Der Autor des Zitats.'
    },
    date: {
      type: [String, Number],
      description: 'Datum des Zitats.'
    },
    source: {
      type: String,
      markup: true,
      description: 'Die Quelle des Zitats'
    }
  }
}
</script>
<style lang="scss" scoped>
  .vc_quote_master_preview {
  }
</style>
