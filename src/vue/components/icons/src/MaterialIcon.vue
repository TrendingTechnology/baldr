<script>
import icons from './icons.json'
import { validateColorName } from './main.js'

export default {
  name: 'MaterialIcon',
  props: {
    name: {
      type: String
    },
    size: {
      type: String
    },
    color: {
      type: String,
      default: 'black',
      validator: validateColorName
    },
    href: {
      type: String
    },
    display: {
      type: String,
      default: 'normal',
      validator: function (value) {
        return ['disabled', 'normal', 'show-on-hover'].includes(value)
      }
    },
    // Umriss
    outline: {
      type: String,
      default: 'icon',
      validator: function (value) {
        return ['circle', 'icon', 'square'].includes(value)
      }
    }
  },
  computed: {
    classes () {
      let classes = ['baldr-icon', 'vc_material_icon']
      classes.push(`baldr-icon_outline_${this.outline}`)
      classes.push(`baldr-icon_${this.name}`)
      if (this.outline !== 'icon') {
        classes.push(`${this.color}`)
        classes.push(`text-white`)
      } else {
        classes.push(`text-${this.color}`)
      }
      classes.push(`baldr-icon_display_${this.display}`)
      return classes
    },
    warningText () {
      if (!icons.includes(this.name)) {
        const message = `No icon named “${this.name}” found!`
        console.warn(message)
        return message
      }
    },
    styleObject () {
      const style = {
        fontSize: this.size
      }
      if (this.display === 'disabled') {
        style.opacity = 0.3
      }
      return style
    }
  },
  render: function (createElement) {
    let elementName = 'div'
    const attributes = {
      class: this.classes,
      style: this.styleObject,
    }
    if (this.href) {
      elementName = 'a'
      attributes.attrs = {
        href: this.href
      }
    }

    return createElement(elementName, attributes, this.warningText)
  }
}
</script>

<style lang="scss">
  @import './style.css';

  a .baldr-icons {
    color: $black;
  }

  $outline-padding: 0.25em;

  .baldr-icon {
    display: inline-block;
    cursor: pointer;

    &.baldr-icon_outline_circle {
      border-radius: 50%;
      padding: $outline-padding;
    }

    &.baldr-icon_outline_square {
      padding: $outline-padding;
    }

    &.baldr-icon_display_normal {
      &:hover {
        color: $red !important;
      }
    }

    &.baldr-icon_display_normal, &.baldr-icon_display_show-on-hover {
      &:active {
        color: $blue !important;
      }

      &:focus {
        color: scale-color($gray, $lightness: -20%) !important;
      }
    }

    &.baldr-icon_display_show-on-hover {
      opacity: 0;

      &:hover {
        opacity: 1;
      }
    }

    &.baldr-icon_display_disabled {
      color: scale-color($black, $lightness: 70%) !important;
    }
  }

  @media print {
    .baldr-icons {
      display: none;
    }
  }
</style>
