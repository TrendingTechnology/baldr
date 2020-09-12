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

<script>

export default {
  name: 'PersonsListItem',
  props: {
    person: Object,
    no: Number
  },
  computed: {
    draggable () {
      if (!this.person.seatNo) return 'true'
      return 'false'
    }
  },
  methods: {
    dragStart (event) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.setData('text/plain', event.currentTarget.title)
    }
  }
}
</script>

<style lang="scss">
  .vc_persons_list_item {
    [draggable="true"] {
      cursor: grab;
    }

    [draggable="true"]:hover {
      color: $red;
    }

    [draggable="false"] {
      text-decoration: line-through;
      color: $gray;
    }
  }
</style>
