<template >
  <div v-if="$nuxt.isOffline">
    <div class="offline-warning-placeholder"></div>
    <div class="offline-warning">You are offline. Some features might not be available.</div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.offline-warning-placeholder {
  height: 2.5em;
}
.offline-warning {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  background: #eb5757;
  color: #fff;
  height: 2.5em;
  line-height: 2.5em;
  text-align: center;
  z-index: 100;
}
</style>
