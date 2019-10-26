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
      this.$store.dispatch('openPresentationById', this.presentation.id)
      this.$router.push('/slides')
    },
    search (title) {
      if (!title) return
      this.$media.httpRequest.request({
        url: 'query-ng',
        method: 'get',
        params: {
          collection: 'presentations',
          method: 'search',
          field: 'title',
          search: title
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
