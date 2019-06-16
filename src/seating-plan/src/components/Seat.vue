<template>
<div class="seat" :id=number>
  <div class="first-name">{{ firstName }}</div>
  <div class="last-name">{{ lastName }}</div>
</div>
</template>

<script>
export default {
  name: 'Seat',
  props: {
    number: Number,
    firstName: String,
    lastName: String
  }
}
</script>

<style scoped>
  .seat {
    border: 1px solid black;
  }
  .first-name {
    font-weight: bold;
  }
  .last-name {
    font-style: italic;
  }
</style>
