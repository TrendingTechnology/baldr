<template>
  <div class="vc_image_master">
    <img v-if="mediaFile" :src="mediaFile.httpUrl"/>
    <div v-if="titleComputed || descriptionComputed" class="metadata">
      <h1
        v-if="!noMeta && titleComputed"
        class="title"
        v-html="titleComputed"
      />
      <p
        v-if="!noMeta && descriptionComputed"
        class="description"
        v-html="descriptionComputed"
      />
    </div>
  </div>
</template>

<script>
import { markupToHtml } from '@/lib.js'
import { createNamespacedHelpers } from 'vuex'
const { mapGetters } = createNamespacedHelpers('presentation')

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

export const master = {
  title: 'Bild',
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

export default {
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
  computed: {
    ...mapGetters(['slideCurrent']),
    titleComputed () {
      if (this.title) return this.title
      if ('title' in this.mediaFile) return markupToHtml(this.mediaFile.title)
      return ''
    },
    descriptionComputed () {
      if (this.description) return this.description
      if ('description' in this.mediaFile) return markupToHtml(this.mediaFile.description)
      return ''
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.src)
    }
  }
}
</script>

<style lang="scss" scoped>
.vc_image_master {
  font-size: 4vw;
  height: 100vh;
  position: relative;
  width: 100vw;

  img {
    bottom: 0;
    left: 0;
    height: 100vh;
    width: 100vw;
    object-fit: contain;
    position: absolute;
  }

  .metadata {
    bottom: 0;
    position: absolute;
    right: 0;
    width: 100%;
    background: rgba(170, 170, 170, 0.3);

    .title {
      font-size: 0.5em;
      text-align: center;
    }

    .description {
      font-size: 0.3em;
      padding: 1em;
    }
  }
}
</style>
