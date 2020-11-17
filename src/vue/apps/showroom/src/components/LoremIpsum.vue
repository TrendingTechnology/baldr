<template>
  <div class="vc_lorem_ipsum">
    <h1>Lorem ipsum</h1>

    <p>Paragraph: Lorem <em>ipsum</em> dolor sit amet, consetetur
    <strong>sadipscing</strong> elitr, sed diam nonumy eirmod tempor
    invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
    At vero eos et accusam et justo duo dolores et ea rebum. Stet clita
    kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
    amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed
    diam nonumy eirmod tempor invidunt ut labore et dolore magna
    aliquyam erat, sed diam voluptua. At vero eos et accusam et justo
    duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata
    sanctus est Lorem ipsum dolor sit amet.</p>

    <h1>Heading 1</h1>
    <h2>Heading 2</h2>
    <h3>Heading 3</h3>
    <h4>Heading 4</h4>

    <h1>Ordered lists</h1>

    <ol>
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ol>

    <h1>Unordered lists</h1>

    <ul class="content">
      <li>one</li>
      <li>two</li>
      <li>three</li>
    </ul>

    <h1>Blockquote</h1>

    <blockquote>
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit,
      amet, adipisci nemo minima autem corporis ea ad animi quas libero,
      pariatur voluptate accusantium possimus vitae doloribus? Commodi
      cum veniam laudantium.
    </blockquote>

    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, sunt
    non. Quod, quaerat! Minus esse dolor ipsum facere quasi aspernatur
    temporibus. Id, rem. Nemo unde dicta fugiat. Amet, error
    consequuntur!

    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ab, sunt
    non. Quod, quaerat! Minus esse dolor ipsum facere quasi aspernatur
    temporibus. Id, rem. Nemo unde dicta fugiat. Amet, error
    consequuntur!
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class LoremIpsum extends Vue {}

</script>
