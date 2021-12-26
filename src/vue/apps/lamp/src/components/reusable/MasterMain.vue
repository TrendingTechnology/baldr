<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { LampTypes } from '@bldr/type-definitions'

import inlineMarkup from '../../inline-markup.js'
import { customStore } from '../../main'
import Master from './Master.vue'

interface NavigationNumbers {
  slideNo: number
  stepNo?: number
}

@Component
export default class MasterMain extends Master {
  /**
   * navigationNumbers (navigation numbers): this.navigationNumbers = { slideNo: 1, stepNo: 1
   * } The properties `slideNo` and `stepNo` had to be bundle into one
   * object, to get a watcher that can execute the two hooks
   * `afterSlideNoChangeOnComponent` and `afterStepNoChangeOnComponent`
   * on demand.
   */
  @Prop({
    type: Object
  })
  navigationNumbers: NavigationNumbers

  /**
   * By default all master components are marked as main components.
   * Main master components register their `this` in the `customStore`
   */
  @Prop({
    type: Boolean,
    default: true
  })
  isPublic = true

  @Watch('navigationNumbers')
  onNavigationNumbersChange (
    newValue: NavigationNumbers,
    oldValue: NavigationNumbers
  ): void {
    this.$nextTick(() => {
      let slideNoChange = false
      if (newValue.slideNo !== oldValue.slideNo) {
        // TODO: remove
        this.master.afterSlideNoChangeOnComponent(
          {
            oldSlideNo: oldValue.slideNo,
            newSlideNo: newValue.slideNo
          },
          this
        )
        slideNoChange = true
        this.afterSlideNoChange({
          oldSlideNo: oldValue.slideNo,
          newSlideNo: newValue.slideNo
        })
      }
      // Previous slide has only one step number
      // oldSlideNo 2 oldStepNo 1 newSlideNo 3 oldStepNo 1
      if (
        newValue.stepNo != null &&
        `${newValue.slideNo}:${newValue.stepNo}` !==
          `${oldValue.slideNo}:${oldValue.stepNo}`
      ) {
        // TODO: remove
        this.master.afterStepNoChangeOnComponent(
          {
            oldStepNo: oldValue.stepNo,
            newStepNo: newValue.stepNo,
            slideNoChange
          },
          this
        )
        this.afterStepNoChange({
          oldStepNo: oldValue.stepNo,
          newStepNo: newValue.stepNo,
          slideNoChange
        })
      }
    })
  }

  afterSlideNoChange (payload: LampTypes.OldAndNewSlideNos) {}

  afterStepNoChange (payload: LampTypes.OldAndNewStepNoAndSlideNoChange) {}

  mounted (): void {
    this.master.afterSlideNoChangeOnComponent(
      {
        newSlideNo: this.navigationNumbers.slideNo
      },
      this
    )
    this.afterSlideNoChange({
      newSlideNo: this.navigationNumbers.slideNo
    })
    if (this.navigationNumbers.stepNo != null) {
      this.master.afterStepNoChangeOnComponent(
        {
          newStepNo: this.navigationNumbers.stepNo,
          slideNoChange: true
        },
        this
      )
      this.afterStepNoChange({
        newStepNo: this.navigationNumbers.stepNo,
        slideNoChange: true
      })
    }
    if (this.isPublic) {
      customStore.vueMasterInstanceCurrent = this
    }
    inlineMarkup.makeReactive()
  }

  beforeDestroy (): void {
    if (this.isPublic) {
      customStore.vueMasterInstanceCurrent = null
    }
  }
}
</script>
