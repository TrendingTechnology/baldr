<template>
  <div class="vc_person_master">
    <img :src="imageFile.httpUrl">
    <div class="info-box">
      <p v-if="birthComputed || deathComputed" class="birth-and-death">{{ birthComputed }} {{ deathComputed }}</p>
      <p class="person important">{{ nameComputed }}</p>
    </div>
  </div>
</template>

<script>
import { masterMixin } from '@/lib.js'

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

export const master = {
  title: 'Porträt',
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
  }
}

export default {
  mixins: [masterMixin],
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
  computed: {
    imageFile () {
      return this.$store.getters['media/mediaFileByUri'](this.image)
    },
    nameComputed () {
      if ('name' in this && this.name) {
        return this.name
      } else if ('name' in this.imageFile) {
        return this.imageFile.name
      }
      return ''
    },
    birthComputed () {
      let birth
      if ('birth' in this && this.birth) {
        birth = this.birth
      } else if ('birth' in this.imageFile) {
        birth = this.imageFile.birth
      }
      if (birth) {
        return `* ${birth}`
      }
      return ''
    },
    deathComputed () {
      let death
      if ('death' in this && this.death) {
        death = this.death
      } else if ('death' in this.imageFile) {
        death = this.imageFile.death
      }
      if (death) {
        return `† ${death}`
      }
      return ''
    }
  }
}
</script>

<style lang="scss" scoped>
  .vc_person_master {
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
