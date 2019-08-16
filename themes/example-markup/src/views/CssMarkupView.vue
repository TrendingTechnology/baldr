<template>
  <main>
    <markup-sample
      title="Class .person"
      markup="<p class='person'>Ludwig van Beethoven</p>"
    />

    <markup-sample
      title="Class .piece"
      markup="<p class='piece'>Symphonie Nr. 5</p>"
    />
  </main>
</template>

<script>
import MarkupSample from '@/components/MarkupSample'

export default {
  name: 'CssMarkupView',
  components: {
    MarkupSample
  }
}
</script>
