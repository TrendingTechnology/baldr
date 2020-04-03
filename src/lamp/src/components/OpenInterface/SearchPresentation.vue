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

<script>
import { openPresentationById } from '@/lib.js'
import router from '@/router.js'

export default {
  name: 'SearchPresentation',
  data: function () {
    return {
      presentation: {},
      options: []
    }
  },
  methods: {
    async onInput () {
      await openPresentationById(this.presentation.id)
      router.push({ name: 'slides-preview', params: { presId: this.presentation.id } })
    },
    search (title) {
      if (!title) return
      this.$media.httpRequest.request({
        url: 'query',
        method: 'get',
        params: {
          type: 'presentations',
          method: 'substringSearch',
          field: 'allTitlesSubtitle',
          search: title,
          result: 'dynamicSelect'
        }
      }).then((response) => {
        this.options = response.data
      })
    }
  },
  mounted () {
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
