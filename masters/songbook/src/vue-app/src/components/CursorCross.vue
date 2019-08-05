<template>
  <ul>
    <li class="previous" title="Vorhergehende Seite (Tastenkürzel: linke Pfeiltaste)"></li>
    <li class="next" title="Nächste Seite (Tastenkürzel: rechte Pfeiltaste)"></li>
  </ul>
</template>

<script>
export default {

}
</script>

<style>
  ul {
    bottom: 0;
    display: flex;
    height: 4vw;
    margin: 0;
    padding: 0;
    position: fixed;
    right: 0;
    width: 10vw;
    z-index: 2;
  }

  li {
    width: 4vw;
    height: 4vw;
    background-size: 100%;
    opacity: 0.1;
    display: block;
  }

  li:hover {
    opacity: 1 !important;
  }

  ul:hover li {
    opacity: 0.3;
  }

  .previous {
    background-image: url('icons/chevron-left.svg');
  }

  .next {
    background-image: url('icons/chevron-right.svg');
  }
</style>
