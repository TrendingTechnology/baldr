<script lang="ts">
import Vue, { VNode, CreateElement } from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { state, iconNames } from '../plugin'

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
  name!: string

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
    if (!iconNames.includes(this.name)) {
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
