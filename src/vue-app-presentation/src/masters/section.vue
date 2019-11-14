<template>
  <div class="vc_section_master">
    {{ heading }}
  </div>
</template>

<script>

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
  icon: 'file-tree',
  color: 'orange-dark',
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
  }
}

export default {
  props: {
    heading: {
      type: String,
      required: true,
      description: 'Die Überschrift / der Titel des Abschnitts.'
    },
    slides: {
      type: Array,
      description: 'Eine Liste mit Folien-Objekten.'
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
