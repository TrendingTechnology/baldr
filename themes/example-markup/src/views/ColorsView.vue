<template>
  <main>

    <div
      v-for="color in colors"
      :key="color"
    >
      {{ color }}
      <div :class="`color-box ${color}-light`"></div>
      <div :class="`color-box ${color}`"></div>
      <div :class="`color-box ${color}-dark`"></div>
    </div>

  </main>
</template>

<script>
export default {
  name: 'ColorsView',
  data () {
    return  {
      colors: [
        'white',
        'yellow',
        'orange',
        'red',
        'brown',
        'gray',
        'green',
        'blue',
        'purple',
        'black'
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  .color-box {
    height: 4vw;
  }

</style>