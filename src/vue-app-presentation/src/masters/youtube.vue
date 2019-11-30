<template>
  <div class="vc_youtube_master">
    <iframe
      :src="`https://www.youtube.com/embed/${id}`"
      frameborder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    />
  </div>
</template>

<script>

const example = `
---
slides:

- title: Short form
  youtube: 5BBahdS6wu4

- title: Long form
  youtube:
    id: xtKavZG1KiM
`

export const master = {
  title: 'YouTube',
  icon: {
    name: 'youtube',
    color: 'red'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { id: props }
    }
    return props
  },
  plainTextFromProps (props) {
    return props.id
  }
}

export default {
  props: {
    id: {
      type: String,
      required: true,
      description: 'Die Youtube-ID (z. B. xtKavZG1KiM).'
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_youtube_master {
    text-align: center;

    iframe {
      width: 75vw;
      height: 75vh;
    }
  }
</style>
