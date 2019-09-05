<template>
  <div class="image-master">
    <img :src="srcResolved"/>
  </div>
</template>

<script>
const examples = [
  {
    title: 'URL: https:',
    data: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Johannes_Brahms_LCCN2016872659.jpg/1280px-Johannes_Brahms_LCCN2016872659.jpg'
    }
  },
  {
    title: 'URL: id:',
    data: {
      src: 'id:Haydn_Joseph'
    }
  },
  {
    title: 'URL: filename:',
    data: {
      src: 'filename:Beethoven_Ludwig-van.jpg'
    }
  }
]

export const master = {
  centerVertically: true,
  darkMode: true,
  slidePadding: 0,
  examples,
  normalizeData (data) {
    if (typeof data === 'string') return [data]
    return data
  }
}

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  },
  computed: {
    srcResolved () {
      return this.$store.getters.media(this.src)
    }
  },
  created () {
    this.$store.dispatch('resolveMedia', this.src)
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
    height: auto;
    left: 0;
    margin: auto;
    max-height: 100%;
    max-width: 100%;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
}
</style>
