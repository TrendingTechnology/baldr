<template>
  <div class="task-master">
    {{ markup }}
  </div>
</template>

<script>
const example = `
---
slides:
  - title: Simple example (as a string)
    task: “Do this” specified as a string!

  - title: Simple example (as a prop)
    task:
      markup: “Do this” specifed as a prop!
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
    return props
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
  .task-master {
    text-align: center;
  }
</style>
