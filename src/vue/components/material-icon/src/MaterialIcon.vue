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
    }
  },
  computed: {
    classes () {
      let classes = ['baldr-icons']
      classes.push(`baldr-icons-${this.name}`)
      classes.push(this.displayMode)
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
