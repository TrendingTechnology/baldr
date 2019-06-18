<template>
  <div :style="style" class="seat" :id=no>
    <div class="first-name">{{ firstName }}</div>
    <div class="last-name">{{ lastName }}</div>
    <div class="no">{{ no }}</div>
  </div>
</template>

<script>
export default {
  name: 'Seat',
  props: {
    person: Object,
    depth: Number,
    no: Number,
    width: Number,
    x: Number,
    y: Number
  },
  computed: {
    style () {
      return `bottom: ${this.y}%; height: ${this.depth}%; left: ${this.x}%; width: ${this.width}%;`;
    },
    firstName () {
      return this.person.firstName
    },
    lastName () {
      return this.person.lastName
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
  .no {
    position: absolute;
    top: 50%;
    left: 50%;
    opacity: 0.2;
  }
</style>
