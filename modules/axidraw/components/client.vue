<template>
  <div>{{ $fetchState }}</div>
</template>

<script>
export default {
  fetchOnServer: false,
  async fetch() {
    this.socket = new WebSocket(`ws://${document.location.host}/axidraw/`);
  },
};
</script>

<style></style>
