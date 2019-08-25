<template>
  <div
    class='html-master'
    v-html="markup"
  />
</template>

<script>
export const master = {
  centerVertically: true,
  darkMode: false,
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
  }
}
</script>
