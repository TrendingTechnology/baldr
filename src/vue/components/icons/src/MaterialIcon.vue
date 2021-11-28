<script lang="ts">
import { CreateElement, VNode, VNodeData } from 'vue'
import { Component, Prop } from 'vue-property-decorator'

import ColorIcon from './ColorIcon.vue'

@Component
export default class MaterialIcon extends ColorIcon {
  @Prop({
    type: String
  })
  size: string

  @Prop({
    type: String
  })
  href: string

  @Prop({
    type: String,
    default: 'normal',
    validator: function (value) {
      return ['disabled', 'normal', 'show-on-hover'].includes(value)
    }
  })
  display: 'disabled' | 'normal' | 'show-on-hover'

  // Umriss
  @Prop({
    type: String,
    default: 'icon',
    validator: function (value) {
      return ['circle', 'icon', 'square'].includes(value)
    }
  })
  outline: 'circle' | 'icon' | 'square'

  @Prop({ type: Boolean })
  vanish: boolean

  get classes () {
    let classes = this.getBaseClasses()
    classes.push(`baldr-icon_outline_${this.outline}`)
    if (this.outline !== 'icon') {
      classes.push(`${this.color}`)
      classes.push(`text-white`)
    } else {
      classes.push(`text-${this.color}`)
    }

    if (this.vanish) {
      if (this.state.vanishIcons) {
        classes.push('vanish-icon')
      } else {
        classes.push('not-vanish-icon')
      }
    }

    classes.push(`baldr-icon_display_${this.display}`)
    return classes
  }

  get styleObject (): Record<string, unknown> {
    const style: { [attr: string]: any } = {
      fontSize: this.size
    }
    if (this.display === 'disabled') {
      style.opacity = 0.3
    }
    return style
  }

  render (createElement: CreateElement): VNode {
    let elementName = 'div'
    const attributes: VNodeData = {
      class: this.classes,
      style: this.styleObject
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

  &.not-vanish-icon {
    opacity: 1;
    transition: 1s;
  }

  &.vanish-icon {
    opacity: 0;
    transition: 1s;
  }

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

  &.baldr-icon_display_normal,
  &.baldr-icon_display_show-on-hover {
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
