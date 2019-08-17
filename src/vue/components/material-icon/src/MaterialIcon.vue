<template>
  <div
    :style="styleFontSize"
    :class="classes"
  >
   {{ warningText }}
  </div>
</template>

<script>
import icons from './icons.json'

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
      let classes = ['baldr-icons']
      classes.push(`baldr-icons-${this.name}`)
      if (this.disabled) classes.push('disabled')
      return classes.join(' ')
    },
    styleFontSize () {
      if (this.size) {
        return `font-size: ${this.size}`
      }
    },
    warningText () {
      if (!icons.includes(this.name)) {
        const message = `No icon named “${this.name}” found!`
        console.warn(message)
        return message
      }
    }
  }
}
</script>

<style lang="scss">
  a .baldr-icons {
    color: $black;
  }
</style>

<style lang="scss" scoped>
  @import './style.css';

  .baldr-icons {
    display: inline-block;

    &:not(.disabled) {
      cursor: pointer;
      display: inline-block;
    }

    &:not(.disabled):hover {
      color: $red;
    }

    &:not(.disabled):active {
      color: $blue;
    }

    &:not(.disabled):focus {
      color: scale-color($gray, $lightness: -20%);
    }

    &.disabled {
      color: $gray;
    }
  }

  @media print {
    .baldr-icons {
      display: none;
    }
  }
</style>
