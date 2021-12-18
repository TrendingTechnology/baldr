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
import { router } from '@/routes'

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
      router.push({
        name: 'slides-preview',
        params: { presRef: this.presentation.ref }
      })
    },
    search (title) {
      if (!title) return
      this.$media.httpRequest
        .request({
          url: 'get/presentations/by-substring',
          method: 'get',
          params: {
            search: title
          }
        })
        .then(response => {
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
