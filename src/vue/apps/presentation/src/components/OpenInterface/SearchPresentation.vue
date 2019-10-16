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
      let response = await this.$media.httpRequest.request({
        url: `query/presentation/match/id/${this.presentation.id}`,
        method: 'get'
      })
      const presentation = response.data
      response = await this.$media.httpRequest.request({
        url: `/media/${presentation.path}`,
        method: 'get'
      })
      await this.$store.dispatch('openPresentation', response.data)
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
