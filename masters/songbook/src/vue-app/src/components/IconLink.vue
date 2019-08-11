<template>
  <a
    v-if="link"
    :href="link"
  >
    <material-icon :name="icon"/>
  </a>
</template>

<script>
export default {
  name: 'IconLink',
  props: {
    link: {
      type: String
    },
    icon: {
      type: String
    }
  }
}
</script>
