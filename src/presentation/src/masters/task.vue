<template>
  <div class="vc_task_master" v-html="markup"/>
</template>

<script>
import marked from 'marked'
import { plainText } from '@bldr/core-browser'

const example = `
---
slides:
  - title: Simple example (as a string)
    task: “Do this” specified as a string!

  - title: Simple example (as a prop)
    task:
      markup: “Do this” specifed as a prop!

  - title: Specified in the markdown format
    task:
      markup: |
        # Heading

        *“Do this”* specified in the markdown format!

  - title: Specified in the HTML format
    task:
      markup: |
        <h1>Heading</h1>

        <em>“Do this”</em> specified in the HTML format!
`

export const master = {
  title: 'Arbeitsauftrag',
  icon: 'comment-alert',
  color: 'yellow-dark',
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = {
        markup: props
      }
    }
    props.markup = marked(props.markup)
    return props
  },
  plainTextFromProps (props) {
    return plainText(props.markup)
  }
}

export default {
  props: {
    markup: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_task_master {
    font-size: 4vw;
    margin: 3vw;
    padding: 4vw;
    text-align: center;
  }
</style>
