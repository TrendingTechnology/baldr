<template>
  <div class="vc_website_master main-app-padding">
    <a class="mono" :href="url">{{ url }}</a>
    <iframe
      :src="url"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
      frameborder="0"
    />
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import MasterMain from '../MasterMain.vue'

@Component
export default class WebsiteMasterMain extends MasterMain {
  masterName = 'website'

  @Prop({
    type: String
  })
  url?: string
}
</script>

<style lang="scss">
.vc_website_master {
  iframe {
    width: 100%;
    height: 90%;
  }
}
</style>
