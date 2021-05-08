<template>
  <div class="vc_person_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p
      class="short-biography font-shadow small"
      v-if="asset.yaml.shortBiography"
      v-html="asset.yaml.shortBiography"
    />
    <div class="title-box">
      <p
        class="birth-and-death font-shadow"
        v-if="birth || death"
      >
        {{ birth }} {{ death }}
      </p>
      <p class="person important transparent-background font-shadow">{{ asset.yaml.name }}</p>
    </div>

    <external-sites :asset="asset"/>
    <!--
    <horizontal-play-buttons
      :samples="asset.famousPieces"
      class="left-bottom-corner"
      v-if="asset.famousPieces"
    /> -->
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
      if (this.asset.yaml.birth != null) {
        return `* ${formatToLocalDate(this.asset.yaml.birth)}`
      }
      return undefined
    },
    death () {
      if (this.asset.yaml.death != null) {
        return `† ${formatToLocalDate(this.asset.yaml.death)}`
      }
      return undefined
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

    .vc_horizontal_play_buttons .manual-title {
      display: none;
    }
  }
</style>
