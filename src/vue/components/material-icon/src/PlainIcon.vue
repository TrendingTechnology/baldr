<script>
import icons from './icons.json'

export default {
  name: 'PlainIcon',
  props: {
    name: {
      type: String
    }
  },
  computed: {
    classes () {
      let classes = ['baldr-icon']
      classes.push(`baldr-icon_${this.name}`)
      return classes
    },
    warningText () {
      if (!icons.includes(this.name)) {
        const message = `No icon named “${this.name}” found!`
        console.warn(message)
        return message
      }
    }
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
