<script lang="ts">
import { CreateElement, VNode } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'

import icons from './icons.json'

@Component
export default class PlainIcon extends Vue {
  @Prop({
    type: String
  })
  name: string

  get classes (): string[] {
    let classes = ['baldr-icon']
    classes.push(`baldr-icon_${this.name}`)
    return classes
  }

  get warningText (): string | undefined {
    if (!icons.includes(this.name)) {
      const message = `No icon named “${this.name}” found!`
      console.warn(message)
      return message
    }
  }

  render (createElement: CreateElement): VNode {
    return createElement(
      'div',
      {
        class: this.classes
      },
      this.warningText
    )
  }
}
</script>
