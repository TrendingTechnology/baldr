<template>
  <main class="vc_colors_view">
    <h1>Farben</h1>
    <div
      v-for="color in colors"
      :key="color"
    >
      <div class="color-row">
        <div :class="`color-box ${color}-light`">.{{ color }}-light</div>
        <div :class="`color-box ${color}`">.{{ color }}</div>
        <div :class="`color-box ${color}-dark`">.{{ color }}-dark</div>
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
  .vc_colors_view {
    .color-row {
      display: flex;
      height: 2em;
      margin: 1em 0;
    }

    .color-box {
      border: 1px solid $gray;
      height: 100%;
      line-height: 1.7em;
      margin-left: 1em;
      padding-left: 1em;
      text-align: left;
      width: 100%;
    }

    .color-box:first-child {
      margin-left: 0;
    }

    .black-light, .black, .black-dark {
      color: $white;
    }
  }
</style>
