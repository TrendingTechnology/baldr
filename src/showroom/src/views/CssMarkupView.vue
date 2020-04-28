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

<script>
import MarkupSample from '@/components/MarkupSample'

export default {
  name: 'CssMarkupView',
  components: {
    MarkupSample
  }
}
</script>
