<template>
  <div class="lorem">

    <h1>Lorem ipsum</h1>

    <p>Paragraph: Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
    eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
    voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
    nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
    diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
    clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet.</p>

    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>

    Person: <p class="person">Ludwig van Beethoven</p>

    <markup-sample
      title="Class .person"
      markup="<p class='person'>Ludwig van Beethoven</p>"
    />

    <markup-sample
      title="Class .piece"
      markup="<p class='piece'>Symphonie Nr. 5</p>"
    />
  </div>
</template>

<script>
import MarkupSample from './MarkupSample'

export default {
  name: 'LoremIpsum',
  components: {
    MarkupSample
  }
}
</script>
