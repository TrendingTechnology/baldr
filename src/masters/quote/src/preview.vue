<template>
  <div :class="classes">
    <p class="text" v-html="text"/>
    <p class="attribution" v-if="author || date">
      <span class="author" v-if="author" v-html="author"/>
      <span v-if="author && date">, </span>
      <span class="date" v-if="date" v-html="date"/>
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
  },
  computed: {
    classes () {
      const classes = [
        'vc_quote_master_preview',
        'slide-preview-fullscreen'
      ]

      if (this.text.length > 400) {
        classes.push('slide-preview-valign-top')
      } else {
        classes.push('slide-preview-valign-center')
      }
      return classes
    }
  }
}
</script>
<style lang="scss">
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
