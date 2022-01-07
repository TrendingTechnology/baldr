<script lang="ts">
import Component from 'vue-class-component'
import { StepController } from '@bldr/dom-manipulator'

import MasterMain from './MasterMain.vue'

@Component
export default class MasterMainWithStepController extends MasterMain {
  data (): { stepController: StepController } {
    return { stepController: null }
  }

  /**
   * An instance of the class `StepController` from the package
   * `@bldr/dom-manipulator`.
   */
  stepController: StepController
}
</script>
