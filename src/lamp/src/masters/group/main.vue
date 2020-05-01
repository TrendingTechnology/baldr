<template>
  <div class="vc_group_master">
    <img class="img-contain" :src="asset.httpUrl">
    <p
      class="short-history font-shadow"
      v-if="asset.shortHistory"
      v-html="asset.shortHistory"
    />
    <p class="members">
      <span class="important">Mitglieder: </span>
      <ul>
        <li class="person" v-for="member in asset.members" :key="member">
          {{ member }}
        </li>
      </ul>
    </p>
    <div class="title-box">
      <div class="period font-shadow">
        <span v-if="startDate" class="start-date">Gründung: {{ startDate }}</span>
        <span v-if="endDate" class="end-date">Auflösung: {{ endDate }}</span>
      </div>
      <p class="name important transparent-background font-shadow">{{ asset.name }}</p>
    </div>
    <external-sites :asset="asset"/>
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
      if (this.asset.startDate) return formatToYear(this.asset.startDate)
      return ''
    },
    endDate () {
      if (this.asset.endDate) return formatToYear(this.asset.endDate)
      return ''
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
      position: absolute;
      top: 5em;
      left: 3em;
    }

    .title-box {
      bottom: 3em;
      position: absolute;
      right: 0;
      width: 100%;

      .name {
        font-size: 4em;
        padding-right: 1em;
        text-align: right;
      }

      .period {
        font-size: 1.5em;
        text-align: right;
        padding-right: 5em;

        .end-date {
          padding-left: 1em;
        }
      }
    }
  }
</style>
