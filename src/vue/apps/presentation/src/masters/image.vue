<template>
  <div class="image-master">
    <img :src="src"/>
  </div>

</template>

<script>
const examples = [
  {
    title: 'URL: https://',
    data: {
      src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Johannes_Brahms_LCCN2016872659.jpg/1280px-Johannes_Brahms_LCCN2016872659.jpg'
    }
  }
]

export const master = {
  centerVertically: true,
  darkMode: true,
  slidePadding: 0,
  examples
}

export default {
  props: {
    src: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.image-master {
  width: 100%;
  height: 100%;
  text-align: center;

  img {
    min-height: 100%;
    max-height: 100%;
    max-width: 100%;
  }
}
</style>
