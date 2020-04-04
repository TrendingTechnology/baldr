<template>
  <div class="vc_group_master">
    <img class="img-contain" :src="group.httpUrl">
    <p
      class="short-history font-shadow"
      v-if="group.shortHistory"
      v-html="group.shortHistory"
    />
    <p class="members">
      <span class="important">Mitglieder: </span>
      <ul>
        <li class="person" v-for="member in group.members" :key="member">
          {{ member }}
        </li>
      </ul>
    </p>
    <div class="info-box">
      <div class="period font-shadow">
        <span v-if="startDate" class="start-date">Gründung: {{ startDate }}</span>
        <span v-if="endDate" class="end-date">Auflösung: {{ endDate }}</span>
      </div>
      <p class="name important transparent-background font-shadow">{{ group.name }}</p>
    </div>
    <external-sites :asset="group"/>
  </div>
</template>

<script>
import { formatToYear } from '@bldr/core-browser'
import ExternalSites from '@/components/ExternalSites.vue'
export default {
  props: {
    mainImage: {
      type: String,
      required: true
    }
  },
  components: {
    ExternalSites
  },
  computed: {
    group () {
      return this.$store.getters['media/mediaFileByUri'](this.mainImage)
    },
    startDate () {
      if (this.group.startDate) return formatToYear(this.group.startDate)
      return ''
    },
    endDate () {
      if (this.group.endDate) return formatToYear(this.group.endDate)
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

    .info-box {
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
