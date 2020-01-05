<template>
  <div class="
    vc_quote_master_preview
    slide-preview-fullscreen
    slide-preview-valign-center
  ">
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
      required: true
    },
    author: {
      type: String
    },
    date: {
      type: [String, Number]
    },
    source: {
      type: String
    }
  }
}
</script>
<style lang="scss" scoped>
  .vc_quote_master_preview {
    padding-left: 10%;
    padding-right: 10%;

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
