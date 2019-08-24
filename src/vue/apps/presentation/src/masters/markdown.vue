<template>
  <div class='markdown-master' v-html="markupConverted">
  </div>
</template>

<script>
import marked from 'marked'

const examples = [
  {
    title: 'Heading',
    data: {
      markup: `# heading 1
## heading 2
### heading 3`
    }
  },
  {
    title: 'Lorem ipsum',
    data: {
      markup: `Lorem ipsum dolor sit amet ...

consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit
esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
cupidatat non proident, sunt in culpa qui officia deserunt mollit
anim id est laborum.`
    }
  },
  {
    title: 'Ordered list',
    data: {
      markup: `1. one
2. two
3. three`
    }
  },
  {
    title: 'Unordered list',
    data: {
      markup: `* one
* two
* three`
    }
  }
]

export const master = {
  centerVertically: true,
  darkMode: false,
  examples,
  normalizeData (data) {
    if (typeof data === 'string') {
      return {
        markup: data
      }
    }
  }
}

export default {
  props: {
    markup: {
      type: String,
      required: true
    }
  },
  computed: {
    markupConverted () {
      return marked(this.markup)
    }
  }
}
</script>
