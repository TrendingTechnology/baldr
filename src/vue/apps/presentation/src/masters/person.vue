<template>
  <div class="person-master">
    <img :src="imageResolved">
    <div class="info-box">
      <p v-if="birth || death" class="birth-and-death">{{ birth }} {{ death }}</p>
      <p class="person important">{{ name }}</p>
    </div>
  </div>
</template>

<script>
const example = `
---
slides:

- title: Not birth and death
  person:
     name: Joseph Haydn
     image: id:Haydn_Joseph

- title: All properties
  person:
     name: Ludwig van Beethoven
     image: id:Beethoven_Ludwig-van
     birth: 1770
     death: 1827
`

export const master = {
  centerVertically: true,
  darkMode: true,
  example,
  normalizeData (data) {
    if ('birth' in data) data.birth = `* ${data.birth}`
    if ('death' in data) data.death = `† ${data.death}`
    return data
  }
}

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    birth: {
      type: String
    },
    death: {
      type: String
    }
  },
  computed: {
    imageResolved () {
      return this.$store.getters.media(this.image)
    }
  },
  created () {
    this.$store.dispatch('resolveMedia', this.image)
  },
  beforeUpdate () {
    this.$store.dispatch('resolveMedia', this.image)
  }
}
</script>

<style lang="scss" scoped>
  .person-master {
    img {
      height: 100vh;
      left: 0;
      object-fit: contain;
      object-position: left bottom;
      position: absolute;
      top: 0;
      width: 100vw;
    }

    .info-box {
      bottom: 4vw;
      position: absolute;
      right: 0;
      width: 100%;

      .birth-and-death {
        font-size: 3vw;
        margin: 0;
        padding-right: 6vw;
        text-align: right;
      }

      .person {
        background: rgba(170, 170, 170, 0.3);
        font-size: 6vw;
        margin: 0;
        padding-right: 4vw;
        text-align: right;
      }
    }
  }

</style>
