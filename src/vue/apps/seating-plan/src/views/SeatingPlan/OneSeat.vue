<template>
  <div
    class="vc_one_seat"
    :id="seat.no"
    :style="style"
    :title="person.id"
    :draggable="draggable"
    @dragover.prevent="dragOver"
    @dragleave.prevent="dragLeave"
    @dragstart="dragStart"
    @drop.prevent="dragDrop"
  >
    <div
      @click="openModalPersonSelect"
      class="person-select-area"
      title="SchülerIn auf diesen Sitz platzieren"
      v-if="!person"
    />
    <div v-if="person" class="first-name">{{ person.firstName }}</div>
    <div v-if="person" class="last-name">{{ person.lastName }}</div>
    <div v-if="person" class="jobs-of-person">
      <persons-jobs :person="person" />
    </div>
    <div class="icons">
      <add-job-icons :person="person" />

      <div class="management-icons">
        <material-icon
          class="add"
          v-if="gradeIsNotPlaced && !person"
          name="account-plus"
          title="SchülerIn auf diesen Sitz platzieren"
          @click.native="openModalPersonSelect"
        />
        <material-icon
          v-if="person.id"
          class="close"
          name="close"
          title="SchülerIn aus dem Sitzplan entfernen"
          @click.native="unplacePerson"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, mapGetters } from '@bldr/vue-packages-bundler'

// Components
import AddJobIcons from '@/components/AddJobIcons.vue'
import PersonsJobs from '@/components/PersonsJobs.vue'
import { Seat, Room } from '@/types'

@Component({
  components: {
    AddJobIcons,
    PersonsJobs
  },
  computed: {
    ...mapGetters(['jobsAsArray', 'seats'])
  }
})
export default class OneSeat extends Vue {
  @Prop()
  seat!: Seat

  seats!: Room

  get draggable () {
    if (this.person.seatNo >= 1 && this.person.seatNo <= this.seats.count) {
      return 'true'
    }
    return 'false'
  }

  get gradeIsNotPlaced () {
    return !this.$store.getters.isGradePlacedCurrent
  }

  get person () {
    return this.$store.getters.personByGradeAndSeatNoCurrent(this.seat.no)
  }

  get style () {
    return `bottom: ${this.seat.y}%; height: ${this.seats.dimension.depth}%; left: ${this.seat.x}%; width: ${this.seats.dimension.width}%;`
  }

  dragDrop (event: DragEvent) {
    const personId = event!.dataTransfer!.getData('text/plain')
    const element = <HTMLElement>event.currentTarget
    this.$store.dispatch('placePerson', {
      seatNo: this.seat.no,
      personId: personId
    })
    if (element.classList) {
      element.classList.remove('dragover')
    }
  }

  dragLeave (event: DragEvent) {
    const element = <HTMLElement>event.currentTarget
    if (element.classList) {
      element.classList.remove('dragover')
    }
  }

  dragOver (event: DragEvent) {
    const element = <HTMLElement>event.currentTarget
    element.classList.add('dragover')
  }

  dragStart (event: DragEvent) {
    event!.dataTransfer!.dropEffect = 'move'
    const element = <HTMLElement>event.currentTarget
    event!.dataTransfer!.setData('text/plain', element.title)
  }

  openModalPersonSelect (event: DragEvent) {
    if (this.person) return
    this.$store.commit('setSeatNoCurrent', this.seat.no)
    this.$modal.show('person-select')
    this.$dynamicSelect.focus()
  }

  unplacePerson (event: DragEvent) {
    this.$store.dispatch('unplacePerson', {
      personId: this.person.id,
      seatNo: this.seat.no
    })
  }
}
</script>

<style lang="scss">
.vc_one_seat {
  border: 1px solid $black;
  position: absolute;
  box-sizing: border-box;

  &[draggable='true'] {
    cursor: grab;
  }

  .first-name {
    font-weight: bold;
    text-align: center;
  }

  .last-name {
    font-style: italic;
    text-align: center;
  }

  .jobs-of-person {
    text-align: center;
  }

  &.dragover {
    background-color: $red;
    opacity: 0.4;
  }

  .icons {
    width: 100%;
    text-align: center;
    position: absolute;
    bottom: 0;
    right: 0;

    .jobs {
      font-size: 0.8em;
    }
  }

  .icons {
    display: none;
  }

  &:hover .icons {
    display: block;
    cursor: pointer;
  }

  .person-select-area {
    cursor: pointer;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
}
</style>
