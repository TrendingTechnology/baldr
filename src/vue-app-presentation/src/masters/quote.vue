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
    </p>
  </div>
</template>

<script>
const example = `
---
slides:

- title: All properties
  quote:
    text: Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.
    author: Johann Wolfgang von Goethe
    date: 1801

- title: Only text
  quote:
    text: Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.

- title: Markup support
  quote:
    text: 'With markup: __This text should be displayed as a bold text.__'
`

export const master = {
  title: 'Zitat',
  icon: 'comment-quote',
  color: 'brown',
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  plainTextFromProps (props) {
    const output = []
    if ('text' in props) output.push(props.text)
    if ('author' in props) output.push(props.author)
    if ('date' in props) output.push(props.date)
    return output.join(' | ')
  }
}

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
    }
  }
}
</script>
<style lang="scss" scoped>
  .vc_quote_master {
    padding-left: 20%;
    padding-right: 20%;

    .text {
      font-style: italic;
    }

    .quotation-mark {
      font-family: $font-family-sans;
      font-weight: 900;
    }

    .attribution {
      font-size: 3vw;
      text-align: right;
    }

    .author {
      font-family: $font-family-small-caps;
    }
  }
</style>
