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
      this.$store.dispatch('media/clear')
      await this.$store.dispatch('presentation/openPresentationById', this.presentation.id)
      if (this.$route.name !== 'slides-overview') {
        this.$router.push({ name: 'slides-overview' })
      }
    },
    search (title) {
      if (!title) return
      this.$media.httpRequest.request({
        url: 'query',
        method: 'get',
        params: {
          type: 'presentations',
          method: 'substringSearch',
          field: 'title',
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
