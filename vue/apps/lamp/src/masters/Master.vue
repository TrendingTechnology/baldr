<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { LampTypes } from '@bldr/type-definitions'

import { Slide as SlideNg } from '@bldr/presentation-parser'

import { masterCollection } from '../masters.js'
import { Slide } from '../content-file.js'

@Component
export default class Master extends Vue {
  /**
   * The name of the master slide. A short name in lower case letters
   * like `audio`.
   */
  masterName!: string

  /**
   * The current slide object.
   */
  @Prop({
    type: Object,
    required: true
  })
  slide!: Slide

  /**
   * The current slide object.
   */
  @Prop({
    type: Object,
    required: true
  })
  slideNg!: SlideNg

  get master (): LampTypes.Master {
    return masterCollection.get(this.masterName)
  }
}
</script>
