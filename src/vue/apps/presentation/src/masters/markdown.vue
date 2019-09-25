<template>
  <div class='markdown-master' v-html="markupConverted">
  </div>
</template>

<script>
import marked from 'marked'

const example = `
---
slides:

- title: Heading
  markdown: |
    # heading 1
    ## heading 2
    ### heading 3

- title: Lorem ipsum
  markdown: |
    Lorem ipsum dolor sit amet ...

    consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
    labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
    exercitation ullamco laboris nisi ut aliquip ex ea commodo
    consequat. Duis aute irure dolor in reprehenderit in voluptate velit
    esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit
    anim id est laborum.

- title: Ordered list
  markdown: |
    1. one
    2. two
    3. three

- title: Unordered list
  markdown: |
    * one
    * two
    * three
`

export const master = {
  styleConfig: {
    centerVertically: true,
    darkMode: false
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        markup: props
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
