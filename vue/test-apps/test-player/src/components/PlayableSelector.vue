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

  @Prop()
  onlySamples!: boolean

  get filteredTestAssets (): Record<string, string>[] | TestAsset[] {
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

    if (this.onlySamples) {
      const testSamples = []

      for (const testAsset of testAssets) {
        if (testAsset.samples != null) {
          for (const key in testAsset.samples) {
            const testSample: Record<string, string> = {
              uuid: testAsset.uuid + testAsset.samples[key]
            }
            if (testAsset.ref != null) {
              testSample.ref = testAsset.ref + testAsset.samples[key]
            }
            testSamples.push(testSample)
          }
        }
      }

      return testSamples
    }

    return testAssets
  }
}
</script>
