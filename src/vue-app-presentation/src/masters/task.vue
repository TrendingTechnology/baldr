<template>
  <div class="vc_task_master" v-html="markup"/>
</template>

<script>
import { masterMixin } from '@/lib.js'
import { plainText } from '@bldr/core-browser'

const example = `
---
slides:

  - title: Different background color
    task: Background color blue
    style:
      background_color: $green;
      color: $blue;
      font_size: 8vw
      font_weight: bold

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
  icon: {
    name: 'comment-alert',
    color: 'yellow-dark',
    size: 'large'
  },
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
    props.markup = props.markup
    return props
  },
  plainTextFromProps (props) {
    return plainText(props.markup)
  }
}

export default {
  mixins: [masterMixin],
  props: {
    markup: {
      type: String,
      required: true,
      markup: true,
      description: 'Text im HTML oder Markdown-Format oder als reinen Text.'
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


<style lang="scss">
  .vc_task_master {
    ol, ul {
      text-align: left !important;
      font-size: 3vw;
      margin: 0em 3em;
    }
  }
</style>
