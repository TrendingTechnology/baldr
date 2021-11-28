<script lang="ts">
import { CreateElement, VNode } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { state } from './plugin.js'

import icons from './icons.json'

type State = { vanishIcons: boolean }

@Component
export default class PlainIcon extends Vue {
  data (): { state: State } {
    return { state }
  }
  state!: State

  @Prop({
    type: String
  })
  name: string

  get classes (): string[] {
    return this.getBaseClasses()
  }

  getCssIconClassName (): string {
    return `baldr-icon_${this.name}`
  }

  getBaseClasses (): string[] {
    return ['baldr-icon', this.getCssIconClassName()]
  }

  get warningText (): string {
    if (!icons.includes(this.name)) {
      const message = `No icon named “${this.name}” found!`
      console.warn(message)
      return message
    }
    return ''
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
