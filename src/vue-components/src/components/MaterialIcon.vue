<template>
  <div
    :style="styleFontSize"
    :class="classes"
  />
</template>

<script>
// import '@mdi/font'
export default {
  name: 'MaterialIcon',
  props: {
    name: {
      type: String
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    }
  },
  computed: {
    classes () {
      let classes = ['mdi']
      classes.push(`mdi-${this.name}`)
      if (this.disabled) classes.push('disabled')
      return classes.join(' ')
    },
    styleFontSize () {
      if (this.size) {
        return `font-size: ${this.size}`
      }
    }
  }
}
</script>

<style>
a .mdi {
  color: black;
}
</style>

<style scoped>
  @import '~@mdi/font/css/materialdesignicons.css';

  div {
    display: inline-block;
  }
  div:not(.disabled) {
    cursor: pointer;
    display: inline-block;
  }
  div:not(.disabled):hover {
    color: red;
  }
  div:not(.disabled):active {
    color: grey;
  }
  div:not(.disabled):focus {
    color: slategray;
  }
  div.disabled {
    color: grey;
  }
  @media print {
    div {
      display: none;
    }
  }
</style>
