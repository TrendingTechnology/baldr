<template>
  <div class="vc_person_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p
      class="short-biography font-shadow smaller"
      v-if="asset.shortBiography"
      v-html="asset.shortBiography"
    />
    <div class="title-box">
      <p
        class="birth-and-death font-shadow"
        v-if="birth || death"
      >
        {{ birth }} {{ death }}
      </p>
      <p class="person important transparent-background font-shadow">{{ asset.name }}</p>
    </div>

    <external-sites :asset="asset"/>
  </div>
</template>

<script>
import ExternalSites from '@/components/ExternalSites.vue'
import { formatToLocalDate } from '@bldr/core-browser'

export default {
  props: {
    asset: {
      type: Object,
      required: true
    }
  },
  components: {
    ExternalSites
  },
  computed: {
    birth () {
      if (this.asset.birth) return `* ${formatToLocalDate(this.asset.birth)}`
      return ''
    },
    death () {
      if (this.asset.death) return `† ${formatToLocalDate(this.asset.death)}`
      return ''
    }
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

    .title-box {
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
