<template>
  <div class="seat"
       :id=seatWidth
       :style="style"
       :title="personId"
       @dragover.prevent="dragover"
       @dragleave.prevent="dragleave"
       @dragstart="dragstart"
       @drop.prevent="drop"
  >
    <div class="first-name">{{ personFirstName }}</div>
    <div class="last-name">{{ personLastName }}</div>
    <div class="no">{{ seat.no }}</div>
  </div>
</template>

<script>
export default {
  name: 'Seat-Placement',
  props: {
    seat: Object,
  },
  computed: {
    style () {
      return `bottom: ${this.seat.y}%; height: ${this.seatDepth}%; left: ${this.seat.x}%; width: ${this.seatWidth}%;`;
    },
    personFirstName () {
      return this.seat.person.firstName
    },
    personLastName () {
      return this.seat.person.lastName
    },
    personId () {
      return this.seat.person.id
    },
    people() {
      return this.$root.$data.seatingPlan.people
    },
    seatWidth() {
      return this.$root.$data.seatingPlan.seats.seatWidth
    },
    seatDepth() {
      return this.$root.$data.seatingPlan.seats.seatDepth
    },
    seats () {
      return this.$root.$data.seatingPlan.seats
    }
  },
  methods: {
    dragstart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    },
    dragover (event) {
      event.currentTarget.classList.add('dragover')
    },
    dragleave (event) {
      if (event.currentTarget.classList) event.currentTarget.classList.remove('dragover')
    },
    drop (event) {
      let data = event.dataTransfer.getData('text/plain')
      let personToBePlaced = this.people.getPersonById(data)
      personToBePlaced.placed = true
      // Drop over a seat which is already placed
      if (this.seat.person.hasOwnProperty('firstName')) {
        let alreadyPlaced = document.querySelector(`.people-item[title="${this.seat.person.id}"]`)
        alreadyPlaced.draggable = true
      }
      if (personToBePlaced.seatNo) {
        this.seats.seats[personToBePlaced.seatNo].person = {}
      }
      personToBePlaced.seatNo = this.seat.no
      this.seat.person = personToBePlaced
      // Disable dragging in the people list of already placed persons.
      let dragSource = document.querySelector(`.people-item[title="${personToBePlaced.id}"]`)
      dragSource.draggable = false
      this.$el.draggable = "true"
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
