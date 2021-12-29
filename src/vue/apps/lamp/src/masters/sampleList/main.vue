<template>
  <div class="vc_sample_list_master">
    <h2 v-if="heading" v-html="heading" />
    <ol :class="cssClassNotNumbered">
      <li v-for="wrappedSample in samples" :key="wrappedSample.uri">
        <play-button
          v-if="wrappedSample.sample"
          :sample="wrappedSample.sample"
        />
        <play-button v-else :sample="wrappedSample" />
        <span v-html="wrappedSample.titleSafe" />
      </li>
    </ol>
  </div>
</template>

<script lang="ts">
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { WrappedUriList } from '@bldr/presentation-parser'

import MasterMain from '../MasterMain.vue'

@Component
export default class SampleListMasterMain extends MasterMain {
  masterName = 'sampleList'

  @Prop({
    type: String
  })
  heading: string

  @Prop({
    type: Object,
    required: true
  })
  samples: WrappedUriList

  @Prop({
    type: Boolean
  })
  notNumbered: boolean

  cssClassNotNumbered (): { 'not-numbered': boolean } {
    return {
      'not-numbered': this.notNumbered
    }
  }
}
</script>

<style lang="scss">
.vc_sample_list_master {
  h2 {
    margin: 4em;
  }

  ol {
    margin: 6em;

    &.not-numbered {
      list-style-type: none;
    }

    li {
      margin-bottom: 1em;
    }

    .vc_play_button {
      transform: translateY(0.2em);
      margin: 0 0.2em;
    }
  }
}
</style>
