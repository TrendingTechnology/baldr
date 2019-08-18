<template>
  <a :href="href">
    <div :class="`circle-icon ${color}`">
      <material-icon size="7vw" :name="icon"/>
    </div>
  </a>
</template>

<script>
export default {
  name: 'CircleIcon',
  props: {
    href: {
      type: String
    },
    icon: {
      type: String
    },
    color: {
      type: String,
      default: 'blue'
    }
  }
}
</script>

<style lang="scss" scoped>
  .circle-icon {
    border-radius: 50%;
    width: 10vw;
    height: 10vw;
    line-height: 10vw;
    text-align: center;
    .baldr-icons {
      color: $white;
      &.normal:hover {
        color: $white;
      }
    }
  }
</style>