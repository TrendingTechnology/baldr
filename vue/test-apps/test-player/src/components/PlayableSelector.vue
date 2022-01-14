 <template>
  <div class="vc_playable_selector">
    <playable-selector-button
      v-for="testAsset in filteredTestAssets"
      :key="testAsset.uuid"
      :test-asset="testAsset"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'
import { Prop } from 'vue-property-decorator'

import { data, TestAsset } from '../app'

import PlayableSelectorButton from './PlayableSelectorButton.vue'

export const eventBus = new Vue()

@Component({ components: { PlayableSelectorButton } })
export default class PlayableSelector extends Vue {
  @Prop()
  testAssets!: TestAsset[]

  @Prop()
  mimeType!: 'audio' | 'video'

  get filteredTestAssets (): TestAsset[] {
    let testAssets: TestAsset[]
    if (this.testAssets != null) {
      testAssets = this.testAssets
    } else {
      testAssets = Object.values(data)
    }

    if (this.mimeType != null) {
      testAssets = testAssets.filter((testAsset: TestAsset) => {
        return this.mimeType === testAsset.mimeType
      })
    }

    return testAssets
  }
}
</script>

<style lang="scss">
.vc_component_wave_form_demo {
  background-color: $yellow;
}
</style>
