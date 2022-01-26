<template>
  <div class="vc_group_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p
      class="short-history font-shadow"
      v-if="asset.meta.shortHistory"
      v-html="asset.meta.shortHistory"
    ></p>
    <p class="members transparent-box font-shadow" v-if="hasMembers">
      <span class="important big">Mitglieder: </span>
      <ul>
        <li class="important person" v-for="member in members" :key="member">
          {{ member }}
        </li>
      </ul>
    </p>
    <div class="title-box">
      <div class="period font-shadow">
        <span v-if="startDate" class="start-date">Gründung: {{ startDate }}</span>
        <span v-if="endDate" class="end-date">Auflösung: {{ endDate }}</span>
      </div>
      <p class="name important transparent-background font-shadow">{{ asset.meta.name }}</p>
    </div>
    <external-sites :asset="asset"/>
    <horizontal-play-buttons
      :src="asset.meta.famousPieces"
      class="left-bottom-corner"
      v-if="asset.meta.famousPieces"
    />
  </div>
</template>

<script lang="ts">
import ExternalSites from '@/components/reusable/ExternalSites.vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { formatToYear } from '@bldr/string-format'
import { Asset } from '@bldr/presentation-parser'

import MasterMain from '../MasterMain.vue'

@Component({
  components: {
    ExternalSites
  }
})
export default class GroupMasterMain extends MasterMain {
  masterName = 'group'
  @Prop({
    type: Object,
    required: true
  })
  asset!: Asset

  get startDate (): string | undefined {
    if (this.asset.meta.startDate) {
      return formatToYear(this.asset.meta.startDate)
    }
  }

  get endDate (): string | undefined {
    if (this.asset.meta.endDate) {
      return formatToYear(this.asset.meta.endDate)
    }
  }

  get members (): string[] {
    if (Array.isArray(this.asset.meta.members)) {
      return this.asset.meta.members
    } else if (typeof this.asset.meta.members === 'string') {
      return [this.asset.meta.members]
    }
    return []
  }

  get hasMembers (): boolean {
    return this.members.length > 0
  }
}
</script>

<style lang="scss">
.vc_group_master {
  .short-history {
    font-style: italic;
    height: 10em;
    position: absolute;
    right: 2em;
    top: 2em;
    width: 20em;
  }

  .members {
    font-size: 0.8em;
    left: 2%;
    position: absolute;
    top: 9%;

    ul li::before {
      content: '';
    }
  }

  .title-box {
    bottom: 2em;
    position: absolute;
    right: 0;
    width: 100%;

    .name {
      font-size: 2em;
      padding-right: 1em;
      text-align: right;
    }

    .period {
      font-size: 1em;
      text-align: right;
      padding-right: 5em;

      .end-date {
        padding-left: 1em;
      }
    }
  }

  .vc_horizontal_play_buttons .manual-title {
    display: none;
  }
}
</style>
