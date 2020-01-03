const example = `
---
slides:

- title: Not birth and death
  person:
     name: Joseph Haydn
     image: id:Haydn

- title: All properties
  person:
     name: Ludwig van Beethoven
     image: id:Beethoven
     birth: 1770
     death: 1827

- title: props from media file
  person:
     image: id:Goethe
`

export default {
  title: 'Porträt',
  props: {
    name: {
      type: String,
      description: 'Der Name der Person'
    },
    image: {
      type: String,
      required: true,
      mediaFileUri: true,
      description: 'Eine URI zu einer Bild-Datei.'
    },
    birth: {
      type: [String, Number],
      description: 'Datumsangabe zum Geburtstag'
    },
    death: {
      type: [String, Number],
      description: 'Datumsangabe zum Todestag'
    }
  },
  icon: {
    name: 'clipboard-account',
    color: 'orange'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      return {
        image: props
      }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.image]
  },
  titleFromProps (props) {
    if ('name' in props) {
      return props.name
    } else {
      return props.image
    }
  },
  collectPropsMain (props) {
    const image = this.$store.getters['media/mediaFileByUri'](props.image)
    const imageHttpUrl = image.httpUrl

    let name
    if ('name' in props && props.name) {
      name = props.name
    } else if ('name' in image) {
      name = image.name
    }

    let birth
    if ('birth' in props && props.birth) {
      birth = props.birth
    } else if ('birth' in image) {
      birth = image.birth
    }
    if (birth) {
      birth = `* ${birth}`
    }

    let death
    if ('death' in props && props.death) {
      death = props.death
    } else if ('death' in image) {
      death = image.death
    }
    if (death) {
      death = `† ${death}`
    }

    return {
      name, birth, death, imageHttpUrl
    }
  },
  collectPropsPreview ({ propsMain }) {
    return {
      imageHttpUrl: propsMain.imageHttpUrl,
      name: propsMain.name
    }
  }
}
