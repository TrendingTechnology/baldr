<template>
  <div class='quote-master'>
    <p class="text">
      <span class="quotation-mark">»</span>
        {{text }}
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
const examples = [
  {
    path: 'all',
    title: 'All properties',
    data: {
      text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.',
      author: 'Johann Wolfgang von Goethe',
      date: 1801
    }
  },
  {
    path: 'only-text',
    title: 'Only text',
    data: {
      text: 'Der Tag der Gunst ist wie der Tag der Ernte, man muss geschäftig sein sobald sie reift.'
    }
  }
]

export const master = {
  name: 'quote',
  centerVertically: true,
  darkMode: true,
  examples
}

export default {
  name: 'QuoteMaster',
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
    }
  },
  centerVertically: true,
  darkMode: true,
  examples
}
</script>
<style lang="scss" scoped>
  .quote-master {
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
