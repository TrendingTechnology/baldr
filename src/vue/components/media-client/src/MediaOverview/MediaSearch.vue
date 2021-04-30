<template>
  <div class="vc_media_search">
    <div>
      Suchfeld:
      <a href="#/media"
        :class="{ 'current-search-field': searchField === currentSearchField }"
        v-for="searchField in searchFields"
        :key="searchField"
        @click="setSearchField(searchField)"
      >{{ searchField }} </a>
    </div>
    <dynamic-select
      :options="options"
      @input="onInput"
      v-model="asset"
      @search="search"
      placeholder="Suche nach Medien-Dateien"
    />
  </div>
</template>

<script>
import { DynamicSelect } from '@bldr/dynamic-select'

export default {
  name: 'MediaSearch',
  components: {
    DynamicSelect
  },
  data: function () {
    return {
      asset: {},
      options: [],
      searchFields: ['id', 'title', 'path'],
      currentSearchField: 'title'
    }
  },
  methods: {
    setSearchField (searchField) {
      this.currentSearchField = searchField
    },
    onInput () {
      const uri = `ref:${this.asset.ref}`
      this.$media.resolve(uri)
    },
    search (text) {
      if (!text) return
      this.$media.httpRequest.request({
        url: 'query',
        method: 'get',
        params: {
          type: 'assets',
          method: 'substringSearch',
          field: this.currentSearchField,
          search: text,
          result: 'dynamicSelect'
        }
      }).then((response) => {
        this.options = response.data
      })
    }
  }
}
</script>

<style lang="scss">
  .vc_media_search {
    .current-search-field {
      font-weight: bold;
    }
  }
</style>
