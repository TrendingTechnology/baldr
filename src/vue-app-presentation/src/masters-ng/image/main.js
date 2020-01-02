const example = `
---
slides:

- title: no_meta
  image:
    src: id:Bach
    title: A title
    description: A description
    no_meta: true

- title: no_meta
  image:
    src: id:Bach
    title: A title
    description: A description
    no_meta: false

- title: Kurzform
  image: id:Bach

- title: 'URL: http:'
  image:
    src: http://upload.wikimedia.org/wikipedia/commons/e/e8/Frederic_Chopin_photo.jpeg

- title: 'URL: https:'
  image:
    src: https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Johannes_Brahms_LCCN2016872659.jpg/1280px-Johannes_Brahms_LCCN2016872659.jpg

- title: 'URL: id:'
  image:
    src: id:Haydn

- title: 'URL: filename:'
  image:
    src: filename:Beethoven_Ludwig-van.jpg
`

export default {
  title: 'Bild',
  props: {
    src: {
      type: String,
      required: true,
      description: 'Den URI zu einer Bild-Datei.',
      mediaFileUri: true
    },
    title: {
      type: String,
      markup: true,
      description: 'Ein Titel, der angezeigt wird.'
    },
    description: {
      type: String,
      markup: true,
      description: 'Eine Beschreibung, die angezeigt wird.'
    },
    noMeta: {
      type: Boolean,
      description: 'Beeinflusst, ob Metainformation wie z. B. Titel oder Beschreibung angezeigt werden sollen.',
      default: false
    }
  },
  icon: {
    name: 'image',
    color: 'green'
  },
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string') {
      props = { src: props }
    }
    return props
  },
  resolveMediaUris (props) {
    return [props.src]
  }
}
