<template>
  <div class="vc_image_master_preview">
    <img :src="httpUrl"/>
  </div>
</template>

<script>
export default {
  props: ['httpUrl']
}
</script>
