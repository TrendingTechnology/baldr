<template>
  <dynamic-select
    class="vc_search_presentation"
    :options="options"
    @input="onInput"
    v-model="presentation"
    @search="search"
    placeholder="nach einer Präsentation suchen"
  />
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

import * as api from '@bldr/api-wrapper'

import { router } from '../../../lib/router-setup'

interface DynamicSelectOption {
  ref: string
  name: string
}

@Component
export default class SearchPresentation extends Vue {
  data (): {
    presentation: DynamicSelectOption
    options: DynamicSelectOption[]
    } {
    return {
      presentation: null,
      options: []
    }
  }

  presentation: DynamicSelectOption

  options: DynamicSelectOption[]

  async onInput (): Promise<void> {
    router.push({
      name: 'slides-preview',
      params: { presRef: this.presentation.ref }
    })
  }

  search (title: string): void {
    if (title == null) {
      return
    }
    api.getDynamicSelectPresentations(title).then(results => {
      this.options = results
    })
  }

  mounted (): void {
    this.$dynamicSelect.focus()
  }
}
</script>

<style lang="scss">
.vc_search_presentation {
  .result {
    font-size: 0.7em;
  }
}
</style>
