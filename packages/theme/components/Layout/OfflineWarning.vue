<template>
  <div class="offline-warning" v-if="$nuxt.isOffline">
    You are offline. Some features might not be available.
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.offline-warning {
  position: fixed;
  bottom: 0;
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
