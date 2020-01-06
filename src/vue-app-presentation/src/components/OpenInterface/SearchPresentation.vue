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
import { openPresentation } from '@/lib.js'

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
      await openPresentation(this.presentation.id)
    },
    search (title) {
      if (!title) return
      this.$media.httpRequest.request({
        url: 'query',
        method: 'get',
        params: {
          type: 'presentations',
          method: 'substringSearch',
          field: 'titleSubtitle',
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
