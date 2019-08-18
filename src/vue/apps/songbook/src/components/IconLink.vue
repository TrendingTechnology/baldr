<template>
  <a
    :href="link"
    v-if="link"
  >
    <material-icon
      :name="icon"
      :show-on-hover="showOnHover"
      size="3vw"
    />
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
    },
    showOnHover: {
      default: false,
      type: Boolean
    }
  }
}
</script>
