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
    icon: {
      default: null,
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
      if (this.icon) return ''
      let classes = ['baldr-icons']
      classes.push(`baldr-icons-${this.name}`)
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
  @import './style.css';

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

  .icon {
    height: 1em;
    width: 1em;
    display: inline-block;
  }

  .icon-musescore {
    background: url('icons/musescore.svg') left center no-repeat;
  }
</style>
