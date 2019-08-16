<template>
  <main>
    <dynamic-select
      :options="composer"
      @input="onInput"
      v-model="selectedComposer"
    />
  </main>
</template>

<script>
export default {
  name: 'DynamicSelectView',
  data: function () {
    return {
      selectedComposer: {},
      composer: [
        {
          id: 1,
          name: 'Joseph Haydn'
        },
        {
          id: 2,
          name: 'Wolfgang Amadeus Mozart'
        },
        {
          id: 3,
          name: 'Ludwig van Beethoven'
        }
      ]
    }
  },
  methods: {
    onInput () {
      console.log(this.selectedComposer.name)
    }
  }
}
</script>
