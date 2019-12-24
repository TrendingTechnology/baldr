<template>
  <div class="vc_section_master default-padding" v-html="heading"/>
</template>

<script>
import { plainText } from '@bldr/core-browser'

const example = `
---
slides:

- title: Short form
  section: A section

- title: Long form
  section:
    heading: A section
`

export const master = {
  title: 'Abschnitt',
  icon: {
    name: 'file-tree',
    color: 'orange-dark'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { heading: props }
    }
    return props
  },
  plainTextFromProps (props) {
    return plainText(props.heading)
  }
}

export default {
  props: {
    heading: {
      type: String,
      required: true,
      markup: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_section_master {
    font-family: $font-family-sans-small-caps;
    font-size: 5vw;
    font-weight: bold;
    text-align: center;
  }
</style>
