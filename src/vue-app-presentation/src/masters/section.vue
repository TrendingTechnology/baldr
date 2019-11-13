<template>
  <div class="vc_section_master">
    {{ title }}
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
    title: A section
`

export const master = {
  title: 'Abschnitt',
  icon: 'file-presentation-box',
  color: 'purple',
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { title: props }
    }
    return props
  }
}

export default {
  props: {
    title: {
      type: String,
      required: true,
      description: 'Der Titel des Abschnitts.'
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
