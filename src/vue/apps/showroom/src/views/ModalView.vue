<template>
  <main>
    <button @click="showModal('modal1')">Open Modal 1</button>
    <button @click="showModal('modal2')">Open Modal 2</button>

    <modal-dialog name="modal1">
      Your modal content.
      <lorem-ipsum/>
    </modal-dialog>

    <modal-dialog name="modal2">
      Your modal content.
    </modal-dialog>
  </main>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class ModalView extends Vue {
  public showModal (name: string): void {
    this.$modal.show(name)
  }
}
</script>
