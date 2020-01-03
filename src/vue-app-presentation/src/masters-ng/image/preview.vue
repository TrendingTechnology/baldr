<template>
  <div class="vc_image_master_preview slide-preview-wrapper">
    <img :src="imageHttpUrl" class="image-contain"/>
  </div>
</template>

<script>
export default {
  props: {
    imageHttpUrl: {
      type: String
    }
  }
}
</script>
