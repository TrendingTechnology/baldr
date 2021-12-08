<template>
  <li
    :title="person.id"
    :key="person.lastname"
    @dragstart="dragStart"
    :draggable="draggable"
    :class="{ placed: person.seatNo }"
    class="vc_persons_list_item"
  >
    {{ person.lastName }}, {{ person.firstName }}
  </li>
</template>

<script lang="ts">
import { Component, Prop, Vue } from '@bldr/vue-packages-bundler'
import { Person } from '../../types'

@Component
export default class PersonsListItem extends Vue {
  @Prop()
  person!: Person

  @Prop()
  no!: number

  get draggable () {
    if (!this.person.seatNo) return 'true'
    return 'false'
  }

  dragStart (event: DragEvent) {
    event!.dataTransfer!.dropEffect = 'move'
    const element = <HTMLElement>event.currentTarget
    event!.dataTransfer!.setData('text/plain', element.title)
  }
}
</script>

<style lang="scss">
.vc_persons_list_item {
  &[draggable='true'] {
    cursor: grab;
  }

  &[draggable='true']:hover {
    color: $red;
  }

  &[draggable='false'] {
    text-decoration: line-through;
    color: $gray;
  }
}
</style>
