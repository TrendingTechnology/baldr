<script lang="ts">
import Component from 'vue-class-component'
import { Prop, Watch } from 'vue-property-decorator'

import { LampTypes } from '@bldr/type-definitions'

import inlineMarkup from '../inline-markup.js'
import { customStore } from '../main'
import Master from './Master.vue'

interface NavigationNumbers {
  slideNo: number
  stepNo?: number
}

@Component
export default class MasterMain extends Master {
  /**
   * The current slide object.
   */
  @Prop({
    type: Object,
    required: true
  })
  slide: any

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
   * afterSlideNoChange ({ oldSlideNo, newSlideNo }) {
   *   const slide = this.$store.getters['lamp/slideByNo'](newSlideNo)
   * }
   * ```
   */
  afterSlideNoChange (payload: LampTypes.OldAndNewSlideNos) {}

  /**
   * This hook is executed on the component after the step number has
   * changed.
   *
   * ```js
   * afterStepNoChange ({ oldStepNo, newStepNo, slideNoChange }) {
   *   if (newStepNo === 1) {
   *     this.stepController.hideFromSubsetBegin()
   *   }
   *   const step = this.stepController.showUpTo(newStepNo)
   * }
   * ```
   */
  afterStepNoChange (payload: LampTypes.OldAndNewStepNoAndSlideNoChange) {}

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
