<script>
import icons from './icons.json'
import { validateColorName } from './main.js'

export default {
  name: 'ColorIcon',
  props: {
    name: {
      type: String
    },
    color: {
      type: String,
      default: 'black',
      validator: validateColorName
    }
  },
  computed: {
    classes () {
      let classes = [
        'baldr-icon',
        'vc_color_icon',
        `baldr-icon_${this.name}`,
        `text-${this.color}`
      ]
      return classes
    },
    warningText () {
      if (!icons.includes(this.name)) {
        const message = `No icon named “${this.name}” found!`
        console.warn(message)
        return message
      }
    },
  },
  render: function (createElement) {
    let elementName = 'div'
    const attributes = {
      class: this.classes
    }
    return createElement(elementName, attributes, this.warningText)
  }
}
</script>
