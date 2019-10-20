<template>
  <div class="vc_image_master">
    <img v-if="mediaFile" :src="mediaFile.httpUrl"/>
    <div v-if="titleComputed || descriptionComputed" class="metadata">
      <h1 v-if="titleComputed" class="title">{{ titleComputed }}</h1>
      <p v-if="descriptionComputed" class="description">{{ descriptionComputed }}</p>
    </div>
  </div>
</template>

<script>
const example = `
---
slides:

- title: 'Multiple images to resolve'
  image:
  - id:Bach
  - filename:Haendel_Georg-Friedrich.jpg
  - id:Haydn
  - filename:Beethoven_Ludwig-van.jpg

- title: 'Multiple images without src: Simon & Garfunkel'
  image:
  - https://upload.wikimedia.org/wikipedia/commons/f/f9/Simon_and_Garfunkel_1968.jpg
  - https://upload.wikimedia.org/wikipedia/commons/f/fb/Aankomst_Paul_Simon_%28links%29_en_Art_Garfunkel_op_Schiphol%2C_Bestanddeelnr_919-3035.jpg

- title: 'Multiple images with src: The Beatles'
  image:
    src:
    - https://upload.wikimedia.org/wikipedia/commons/e/e2/Lie_In_15_--_John_rehearses_Give_Peace_A_Chance.jpg
    - https://upload.wikimedia.org/wikipedia/commons/d/d6/Paul_McCartney_in_October_2018.jpg
    - https://upload.wikimedia.org/wikipedia/commons/e/e0/Ringo_Starr_%282007%29.jpg
    - https://upload.wikimedia.org/wikipedia/commons/4/42/George_Harrison_1974.jpg

- title: 'As a string'
  image: id:Bach

- title: 'As a list'
  image:
    src:
    - filename:Haendel_Georg-Friedrich.jpg

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
  icon: 'image',
  color: 'green',
  styleConfig: {
    centerVertically: true,
    darkMode: true
  },
  example,
  normalizeProps (props) {
    if (typeof props === 'string' || Array.isArray(props)) {
      props = { src: props }
    }
    if (typeof props.src === 'string') {
      props = { src: [props.src] }
    }
    return props
  },
  stepCount (props) {
    return props.src.length
  },
  resolveMediaUris (props) {
    return props.src
  }
}

export default {
  props: {
    src: {
      type: [Array],
      required: true
    },
    title: {
      type: String
    },
    description: {
      type: String
    }
  },
  computed: {
    titleComputed () {
      if (this.title) return this.title
      if ('title' in this.mediaFile) return this.mediaFile.title
      return ''
    },
    descriptionComputed () {
      if (this.description) return this.description
      if ('description' in this.mediaFile) return this.mediaFile.description
      return ''
    },
    slide () {
      return this.$store.getters.slideCurrent
    },
    stepNoCurrent () {
      return this.slide.renderData.stepNoCurrent - 1
    },
    uriCurrent () {
      return this.src[this.stepNoCurrent]
    },
    mediaFile () {
      return this.$store.getters['media/mediaFileByUri'](this.uriCurrent)
    }
  }
}
</script>

<style lang="scss" scoped>
.image-master {
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
