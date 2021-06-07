<template>
  <div class="vc_group_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p
      class="short-history font-shadow"
      v-if="asset.yaml.shortHistory"
      v-html="asset.yaml.shortHistory"
    />
    <p class="members transparent-box font-shadow">
      <span class="important big">Mitglieder: </span>
      <ul>
        <li class="person" v-for="member in members" :key="member">
          {{ member }}
        </li>
      </ul>
    </p>
    <div class="title-box">
      <div class="period font-shadow">
        <span v-if="startDate" class="start-date">Gründung: {{ startDate }}</span>
        <span v-if="endDate" class="end-date">Auflösung: {{ endDate }}</span>
      </div>
      <p class="name important transparent-background font-shadow">{{ asset.yaml.name }}</p>
    </div>
    <external-sites :asset="asset"/>
    <horizontal-play-buttons
      :samples="asset.yaml.famousPieces"
      class="left-bottom-corner"
      v-if="asset.yaml.famousPieces"
    />
  </div>
</template>

<script>
import { formatToYear } from '@bldr/core-browser'
import ExternalSites from '@/components/ExternalSites.vue'
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
    startDate () {
      if (this.asset.yaml.startDate) {
        return formatToYear(this.asset.yaml.startDate)
      }
      return false
    },
    endDate () {
      if (this.asset.yaml.endDate) {
        return formatToYear(this.asset.yaml.endDate)
      }
      return false
    },
    members () {
      if (Array.isArray(this.asset.yaml.members)) {
        return this.asset.yaml.members
      } else if (typeof this.asset.yaml.members === 'string') {
        return [this.asset.yaml.members]
      }
      return []
    }
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
      position: absolute;
      top: 2em;
      left: 1em;
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
