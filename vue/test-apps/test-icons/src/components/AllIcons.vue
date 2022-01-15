<template>
  <div class="vc_all_icons">
    <h1>All Icons</h1>

    <div class="all-icons">
      <icon-info
        v-for="name in iconNames"
        :key="name"
        :name="name"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import IconInfo from './IconInfo.vue'

@Component({ components: { IconInfo } })
export default class AllIcons extends Vue {
  get iconNames () {
    return Object.keys(config.iconFont.iconMapping).sort()
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
