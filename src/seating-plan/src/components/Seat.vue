<template>
<div :style="style" class="seat" :id=no>
  <div class="first-name">{{ firstName }}</div>
  <div class="last-name">{{ lastName }}</div>
</div>
</template>

<script>
export default {
  name: 'Seat',
  props: {
    firstName: String,
    depth: Number,
    lastName: String,
    no: Number,
    width: Number,
    x: Number,
    y: Number
  },
  computed: {
    style () {
      return `bottom: ${this.y}%; height: ${this.depth}%; left: ${this.x}%; width: ${this.width}%;`;
    }
  }
}
</script>

<style scoped>
  .seat {
    border: 1px solid black;
    position: absolute;
    background-color: white;
  }
  .first-name {
    font-weight: bold;
  }
  .last-name {
    font-style: italic;
  }
</style>
