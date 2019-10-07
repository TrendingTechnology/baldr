<template>
  <div>
    <dynamic-select
      :options="options"
      @input="onInput"
      v-model="presentation"
      @search="search"
    />
    <section class="brand">
      <div>
        <material-icon
          size="20vw"
          outline="circle"
          name="presentation"
          color="orange"
        />
      </div>
      <div class="brand-name">
        <div>
          Baldr
        </div>
        <div>
          Presentation
        </div>
      </div>
    </section>
    <open-files/>
  </div>
</template>

<script>
import OpenFiles from './OpenFiles.vue'
export default {
  name: 'Home',
  components: {
    OpenFiles
  },
  mounted: function () {
    this.$styleConfig.set()
  },
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

<style lang="scss" scoped>
  .brand {
    display: flex;
    padding-bottom: 5vw;
    text-align: center;

    .brand-name {
      color: $orange;
      font-family: $font-family-sans-small-caps;
      font-size: 8vw;
      text-align: left;
      font-weight: bold;
      padding-left: 3vw;
      padding-top: 6vw;
    }
  }
</style>
