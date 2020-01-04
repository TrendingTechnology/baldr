<template>
  <div class="vc_quote_master">
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
  .vc_quote_master {
    padding-left: 10%;
    padding-right: 10%;
    font-size: 3vw;

    .text {
      font-style: italic;
    }

    .quotation-mark {
      font-family: $font-family-sans;
      font-weight: 900;
    }

    .attribution {
      font-size: 0.8em;
      text-align: right;
    }

    .author {
      font-family: $font-family-small-caps;
    }
  }
</style>
