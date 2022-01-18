<script lang="ts">
/* eslint-disable no-empty-pattern, @typescript-eslint/no-empty-function */

import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { LampTypes } from '@bldr/type-definitions'

import inlineMarkup from '../lib/inline-markup'
import Master from './Master.vue'

interface NavigationNumbers {
  slideNo: number
  stepNo?: number
}

@Component
export default class MasterMain extends Master {
  /**
   * The properties `slideNo` and `stepNo` had to be bundled into one
   * object to get a watcher that can execute the two hooks
   * `afterSlideNoChange` and `afterStepNoChange`
   * on demand.
   */
  @Prop({
    type: Object,
    required: true
  })
  navigationNumbers: NavigationNumbers

  /**
   * By default all master components are marked as main components.
   */
  @Prop({
    type: Boolean,
    default: true
  })
  isPublic: boolean

  @Watch('navigationNumbers')
  onNavigationNumbersChange (
    newValue: NavigationNumbers,
    oldValue: NavigationNumbers
  ): void {
    this.$nextTick(() => {
      let slideNoChange = false

      if (newValue.slideNo !== oldValue.slideNo) {
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
        this.afterStepNoChange({
          oldStepNo: oldValue.stepNo,
          newStepNo: newValue.stepNo,
          slideNoChange
        })
      }
    })
  }

  /**
   * This hook is executed on the component after the slide number has
   * changed.
   *
   * ```js
   * import { LampTypes } from '@bldr/type-definitions'
   *
   * afterSlideNoChange ({ oldSlideNo, newSlideNo }: LampTypes.OldNewSlideNos): void {
   *   const slide = this.$store.getters['lamp/slideByNo'](newSlideNo)
   * }
   * ```
   */
  afterSlideNoChange ({}: LampTypes.OldNewSlideNos): void {}

  /**
   * This hook is executed on the component after the step number has
   * changed.
   *
   * ```js
   * import { LampTypes } from '@bldr/type-definitions'
   *
   * afterStepNoChange ({ oldStepNo, newStepNo, slideNoChange }: LampTypes.OldNewStepSlideNos): void {
   *   if (newStepNo === 1) {
   *     this.stepController.hideFromSubsetBegin()
   *   }
   *   const step = this.stepController.showUpTo(newStepNo)
   * }
   * ```
   */
  afterStepNoChange ({}: LampTypes.OldNewStepSlideNos): void {}

  mounted (): void {
    this.afterSlideNoChange({
      newSlideNo: this.navigationNumbers.slideNo
    })

    if (this.navigationNumbers.stepNo != null) {
      this.afterStepNoChange({
        newStepNo: this.navigationNumbers.stepNo,
        slideNoChange: true
      })
    }

    inlineMarkup.makeReactive()
  }
}
</script>
