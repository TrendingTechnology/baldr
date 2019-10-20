<template>
  <dynamic-select
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
        url: 'query/presentations/search/title',
        method: 'get',
        params: {
          substring: title
        }
      }).then((response) => {
        this.options = response.data
      })
    }
  }
}
</script>
