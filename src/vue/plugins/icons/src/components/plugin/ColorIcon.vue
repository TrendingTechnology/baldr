<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { validateColorName } from '../../plugin.js'
import PlainIcon from './PlainIcon.vue'

@Component
export default class ColorIcon extends PlainIcon {
  @Prop({
    type: String,
    default: 'black',
    validator: validateColorName
  })
  color: string

  get classes (): string[] {
    const classes = this.getBaseClasses()
    classes.push('vc_color_icon')
    classes.push(`text-${this.color}`)
    return classes
  }
}
</script>
