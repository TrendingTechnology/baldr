<template>
  <div class="vc_person_master">
    <img class="img-contain" :src="imageHttpUrl">
    <p
      class="short-biography font-shadow"
      v-if="shortBiography"
      v-html="shortBiography"
    />
    <div class="info-box">
      <p
        class="birth-and-death font-shadow"
        v-if="birth || death"
      >
        {{ birth }} {{ death }}
      </p>
      <p class="person important transparent-background font-shadow">{{ name }}</p>
    </div>

    <external-sites :asset="person"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'

export default {
  props: {
    name: {
      type: String,
      required: true
    },
    imageHttpUrl: {
      type: String,
      required: true
    },
    birth: {
      type: String
    },
    death: {
      type: String
    },
    shortBiography: {
      type: String
    },
    wikipediaHttpUrl: {
      type: String
    },
    wikidataHttpUrl: {
      type: String
    },
    person: {
      type: Object
    }
  },
  components: {
    ExternalSites
  }
}
</script>

<style lang="scss">
  .vc_person_master {
    .short-biography {
      font-style: italic;
      height: 10em;
      position: absolute;
      right: 1em;
      top: 1em;
      width: 20em;
    }

    .info-box {
      bottom: 2em;
      position: absolute;
      right: 0;
      width: 100%;

      .birth-and-death {
        margin: 0;
        padding-right: 2em;
        text-align: right;
        margin-bottom: 0.4em;
      }

      .person {
        font-size: 3em;
        padding-right: 1em;
        text-align: right;
      }
    }
  }
</style>
