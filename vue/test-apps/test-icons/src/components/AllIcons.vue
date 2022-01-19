<template>
  <div class="vc_all_icons">
    <icon-group v-for="name in groupNames" :key="name" :group-name="name" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import { groupedIcons } from '../app'

import IconGroup from './IconGroup.vue'

@Component({ components: { IconGroup } })
export default class AllIcons extends Vue {
  get groupNames () {
    const groupNames = Object.keys(groupedIcons).filter((value) => {
      return value !== 'other'
    }).sort()
    groupNames.push('other')
    return groupNames
  }
}
</script>

<style lang="scss">
.vc_all_icons {
  .all-icons {
    columns: 4;

    @media screen and (max-width: 1400px) {
      columns: 3;
    }

    @media screen and (max-width: 1200px) {
      columns: 2;
    }

    @media screen and (max-width: 600px) {
      columns: 1;
    }

    .baldr-icon {
      font-size: 3em;
      margin-right: 0.5em;
    }
  }
}
</style>
