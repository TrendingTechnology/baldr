<template>
  <div class="seat"
       :id=no
       :style="style"
       @dragover.prevent="dragover"
       @dragleave.prevent="dragleave"
       @drop.prevent="drop"
  >
    <div class="first-name">{{ firstName }}</div>
    <div class="last-name">{{ lastName }}</div>
    <div class="no">{{ no }}</div>
  </div>
</template>

<script>
export default {
  name: 'Seat-Placement',
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
    },
    people() {
      return this.$root.$data.seatingPlan.people
    }
  },
  methods: {
    dragover (event) {
      event.currentTarget.classList.add('dragover')
    },
    dragleave (event) {
      if (event.currentTarget.classList) event.currentTarget.classList.remove('dragover')
    },
    drop (event) {
      let data = event.dataTransfer.getData('text/plain')
      let person = this.people.getPersonById(data)
      console.log(person)
      if (event.currentTarget.classList) event.currentTarget.classList.remove('dragover')
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
  .dragover {
    background-color: red;
  }
</style>
