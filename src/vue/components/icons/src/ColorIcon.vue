<script lang="ts">
import { CreateElement, VNode } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import icons from './icons.json'
import { validateColorName } from './main.js'

@Component
export default class ColorIcon extends Vue {
  @Prop({
    type: String
  })
  name: string

  @Prop({
    type: String,
    default: 'black',
    validator: validateColorName
  })
  color: string

  get classes () {
    let classes = [
      'baldr-icon',
      'vc_color_icon',
      `baldr-icon_${this.name}`,
      `text-${this.color}`
    ]
    return classes
  }

  get warningText () {
    if (!icons.includes(this.name)) {
      const message = `No icon named “${this.name}” found!`
      console.warn(message)
      return message
    }
  }

  render (createElement: CreateElement): VNode {
    let elementName = 'div'
    const attributes = {
      class: this.classes
    }
    return createElement(elementName, attributes, this.warningText)
  }
}
</script>
