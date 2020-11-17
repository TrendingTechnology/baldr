<template>
  <main>
    <lorem-ipsum/>
  </main>
</template>

<script lang="ts">
import LoremIpsum from '@/components/LoremIpsum.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    LoremIpsum
  }
})
export default class TypographyView extends Vue {}
</script>
