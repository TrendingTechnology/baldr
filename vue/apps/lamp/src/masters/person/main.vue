<template>
  <div class="vc_person_master">
    <img class="img-contain" :src="mainImageHttpUrl" />
    <p
      class="short-biography font-shadow small"
      v-if="shortBiography"
      v-html="shortBiography"
    />
    <div class="title-box">
      <p class="birth-and-death font-shadow" v-if="birth || death">
        {{ birth }} {{ death }}
      </p>
      <p class="person important transparent-background font-shadow">
        {{ name }}
      </p>
    </div>

    <external-sites :asset="asset" />

    <horizontal-play-buttons
      :src="famousPieces"
      class="left-bottom-corner"
      v-if="famousPieces"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { Asset, personMModul } from '@bldr/presentation-parser'

import ExternalSites from '@/components/reusable/ExternalSites.vue'
import { formatToLocalDate } from '@bldr/string-format'

import MasterMain from '../MasterMain.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class PersonMasterMain extends MasterMain {
  masterName = 'person'

  @Prop({
    type: Object,
    required: true
  })
  asset!: Asset

  get mainImage (): Asset {
    if (this.slideNg.fields?.personId == null) {
      throw new Error('Missing field personId')
    }
    const uri = personMModul.convertPersonIdToMediaUri(
      this.slideNg.fields.personId
    )
    return this.$store.getters['lamp/media/assetByUri'](uri)
  }

  get mainImageHttpUrl (): string {
    return this.mainImage.httpUrl
  }

  get name (): string {
    return this.mainImage.meta.name
  }

  get shortBiography (): string | undefined {
    if (this.mainImage.meta.shortBiography != null) {
      return this.mainImage.meta.shortBiography
    }
  }

  get birth (): string | undefined {
    if (this.mainImage.meta.birth != null) {
      return `* ${formatToLocalDate(this.mainImage.meta.birth)}`
    }
  }

  get death (): string | undefined {
    if (this.mainImage.meta.death != null) {
      return `† ${formatToLocalDate(this.mainImage.meta.death)}`
    }
  }

  get famousPieces (): string | string[] {
    return this.mainImage.meta.famousPieces
  }
}
</script>

<style lang="scss">
.vc_person_master {
  .short-biography {
    font-style: italic;
    height: 10em;
    position: absolute;
    left: 3em;
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
