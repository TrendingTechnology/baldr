<template>
  <main>
    <div
      v-for="color in colors"
      :key="color"
    >
      <div class="color-wrapper">
        <div :class="`color ${color}-light`">.{{ color }}-light</div>
        <div :class="`color ${color}`">.{{ color }}</div>
        <div :class="`color ${color}-dark`">.{{ color }}-dark</div>
      </div>
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
  .color-wrapper {
    height: 4vw;
    display: flex;
    margin: 1vw 0;
  }

  .color {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 4vw;
  }
</style>
