<template>
  <main>
    <markup-sample
      title="Class <code>.person</code>"
      markup="<p class='person'>Ludwig van Beethoven</p>"
    />

    <markup-sample
      title="Class <code>.piece</code>"
      markup="<p class='piece'>Symphonie Nr. 5</p>"
    />

    <markup-sample
      title="Class <code>.important</code>"
      markup="<span class='important'>Important:</span> very important"
    />

    <markup-sample
      title="Tag: code"
      markup="<code>print(Hello World)</code>"
    />
  </main>
</template>

<script lang="ts">
import MarkupSample from '@/components/MarkupSample.vue'
import { Component, Vue } from 'vue-property-decorator'

@Component({
  components: {
    MarkupSample
  }
})
export default class CssMarkupView extends Vue {}
</script>
