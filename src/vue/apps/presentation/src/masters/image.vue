<template>
  <div class="image-master">
    <img v-if="mediaFile" :src="mediaFile.httpUrl"/>
  </div>
</template>

<script>
const example = `
---
slides:

- title: 'Multiple images to resolve'
  image:
  - id:Bach_Johann-Sebastian
  - filename:Haendel_Georg-Friedrich.jpg
  - id:Haydn_Joseph
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
  image: id:Bach_Johann-Sebastian

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
    src: id:Haydn_Joseph

- title: 'URL: filename:'
  image:
    src: filename:Beethoven_Ludwig-van.jpg
`

export const master = {
  styleConfig: {
    centerVertically: true,
    darkMode: true,
    slidePadding: 0
  },
  example,
  normalizeData (data) {
    if (typeof data === 'string' || Array.isArray(data)) {
      data = { src: data }
    }
    if (typeof data.src === 'string') {
      data = { src: [data.src] }
    }
    return data
  },
  stepCount (data) {
    return data.src.length
  },
  mediaUris (props) {
    return props.src
  }
}

export default {
  props: {
    src: {
      type: [String, Array],
      required: true
    }
  },
  computed: {
    slide () {
      return this.$store.getters.slideCurrent
    },
    stepNoCurrent () {
      return this.slide.master.stepNoCurrent - 1
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
}
</style>
