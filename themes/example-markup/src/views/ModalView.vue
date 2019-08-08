<template>
  <main>
    <button @click="open('modal1')">Open Modal 1</button>
    <modal-dialog name="modal1">
      Your modal content.
      <lorem-ipsum/>
    </modal-dialog>

    <button @click="open('modal2')">Open Modal 2</button>
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
    open (name) {
      this.$modal.open(name)
    }
  }
}
</script>
