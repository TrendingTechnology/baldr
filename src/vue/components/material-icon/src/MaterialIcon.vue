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
    showOnHover: {
      type: Boolean,
      default: false
    },
    size: {
      type: String
    },
    href: {
      type: String
    },
    circle: {
      type: Boolean,
      default: false
    },
    square: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes () {
      let classes = ['baldr-icons']
      classes.push(`baldr-icon_${this.name}`)
      classes.push(this.displayMode)
      if (this.circle) classes.push('circle')
      if (this.square) classes.push('square')
      return classes.join(' ')
    },
    warningText () {
      if (!icons.includes(this.name)) {
        const message = `No icon named “${this.name}” found!`
        console.warn(message)
        return message
      }
    },
    displayMode () {
      if (this.showOnHover) {
        return 'show-on-hover'
      } else if (this.disable) {
        return 'disabled'
      } else {
        return 'normal'
      }
    },
  },
  render: function (createElement) {
    let elementName = 'div'
    const attributes = {
      class: this.classes,
      style: {
        fontSize: this.size
      }
    }
    if (this.href) {
      elementName = 'a'
      attributes.attrs = {
        href: this.href
      }
    }
    return createElement(
      elementName,
      attributes,
      this.warningText
    )
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

  .baldr-icons.circle {
    background-color: $red;
    border-radius: 50%;
    padding: 0.5em;
    &::before {
      color: $white;
    }
  }

  .baldr-icons.square {
    background-color: $red;
    padding: 0.5em;
    &::before {
      color: $white;
    }
  }

  .baldr-icons {
    display: inline-block;
    cursor: pointer;
    color: $black;

    &.normal {
      &:hover {
        color: $red;
      }
    }

    &.normal, &.show-on-hover {
      &:active {
        color: $blue;
      }

      &:focus {
        color: scale-color($gray, $lightness: -20%);
      }
    }

    &.show-on-hover {
      opacity: 0;

      &:hover {
        opacity: 1;
      }
    }

    &.disabled {
      color: scale-color($black, $lightness: 70%);
    }
  }

  @media print {
    .baldr-icons {
      display: none;
    }
  }
</style>
