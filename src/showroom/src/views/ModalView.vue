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

<script>
import LoremIpsum from '@/components/LoremIpsum'

export default {
  name: 'ModalView',
  components: {
    LoremIpsum
  },
  methods: {
    showModal (name) {
      this.$modal.show(name)
    }
  }
}
</script>
