<script lang="ts">
import { CreateElement, VNode } from 'vue'
import { Vue, Component, Prop } from 'vue-property-decorator'
import { state } from './main.js'

import icons from './icons.json'

@Component
export default class PlainIcon extends Vue {
  data () {
    return { state }
  }
  state!: any

  @Prop({
    type: String
  })
  name: string

  get classes (): string[] {
    return this.getBaseClasses()
  }

  getCssIconClassName () {
    return `baldr-icon_${this.name}`
  }

  getBaseClasses (): string[] {
    return ['baldr-icon', this.getCssIconClassName()]
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
