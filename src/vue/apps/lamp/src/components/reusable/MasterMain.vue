<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { LampTypes } from '@bldr/type-definitions'

import { masterCollection } from '@bldr/lamp-core'

import inlineMarkup from '../../inline-markup.js'
import { customStore } from '../../main'

interface NavNos {
  slideNo: number
  stepNo: number
}

@Component
export default class MasterMain extends Vue {

  /**
   * navNos (navigation numbers): this.navNos = { slideNo: 1, stepNo: 1
   * } The properties `slideNo` and `stepNo` had to be bundle into one
   * object, to get a watcher that can execute the two hooks
   * `afterSlideNoChangeOnComponent` and `afterStepNoChangeOnComponent`
   * on demand.
   */
  @Prop({
    type: Object
  })
  navNos: NavNos

  /**
   * By default all master components are marked as main components.
   * Main master components register their `this` in the `customStore`
   */
  @Prop({
    type: Boolean,
    default: true
  })
  isPublic: boolean = true

  masterName: string

  get master (): LampTypes.Master {
    return masterCollection.get(this.masterName)
  }

  @Watch('navNos')
  onNavNosChange (newValue: NavNos, oldValue: NavNos) {
    this.$nextTick(() => {
      console.log(this.master)
      let slideNoChange = false
      if (newValue.slideNo !== oldValue.slideNo) {
        this.master.afterSlideNoChangeOnComponent(
          {
            oldSlideNo: oldValue.slideNo,
            newSlideNo: newValue.slideNo
          },
          this
        )
        slideNoChange = true
      }
      // Previous slide has only one step number
      // oldSlideNo 2 oldStepNo 1 newSlideNo 3 oldStepNo 1
      if (
        newValue.stepNo &&
        `${newValue.slideNo}:${newValue.stepNo}` !==
          `${oldValue.slideNo}:${oldValue.stepNo}`
      ) {
        this.master.afterStepNoChangeOnComponent(
          {
            oldStepNo: oldValue.stepNo,
            newStepNo: newValue.stepNo,
            slideNoChange
          },
          this
        )
      }
    })
  }

  mounted () {
    this.master.afterSlideNoChangeOnComponent(
      {
        newSlideNo: this.navNos.slideNo
      },
      this
    )
    if (this.navNos.stepNo) {
      this.master.afterStepNoChangeOnComponent(
        {
          newStepNo: this.navNos.stepNo,
          slideNoChange: true
        },
        this
      )
    }
    if (this.isPublic) {
      customStore.vueMasterInstanceCurrent = this
    }
    inlineMarkup.makeReactive()
  }

  beforeDestroy () {
    if (this.isPublic) {
      customStore.vueMasterInstanceCurrent = null
    }
  }
}
</script>
