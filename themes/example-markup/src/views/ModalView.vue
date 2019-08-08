<template>
  <main>
    <button @click="open">Open Modal</button>
    <modal-dialog name="example">
      Your modal content.
      <lorem-ipsum/>
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
    open () {
      this.$modal.open('example')
    }
  }
}
</script>
