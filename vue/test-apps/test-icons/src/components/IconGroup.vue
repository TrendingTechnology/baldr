<template>
  <div class="vc_icon_group">
    <h1>{{ groupNameSafe }}</h1>

    <div class="all-icons">
      <icon-info v-for="name in iconNames" :key="name" :name="name" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { groupedIcons } from '../app'

import IconInfo from './IconInfo.vue'


@Component({ components: { IconInfo } })
export default class IconGroup extends Vue {
  @Prop()
  groupName!: string

  get groupNameSafe () {
    if (this.groupName == null) {
      return 'all'
    }
    return this.groupName
  }

  get iconNames () {
    if (this.groupName == null) {
      return Object.keys(config.iconFont.iconMapping).sort()
    }
    return Object.keys(groupedIcons[this.groupName]).sort()
  }
}
</script>


<style lang="scss">
.vc_icon_group {
  border-top: solid 3px;
  margin-top: 5em;
}
</style>
