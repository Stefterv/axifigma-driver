<template>
  <div>
    {{ $saxi.state.connected ? "Connected" : "No connection" }}
    <pre>{{ $saxi.state }}</pre>
  </div>
</template>

<script>
export default {
  mounted() {
    // console.log("Mounted Vue");
    // window.parent.postMessage({ pluginMessage: "Hello!" }, "*");
    // window.onmessage = (msg) => {
    //   console.log("Nuxt recieved", msg);
    // };
  },
};
</script>

<style></style>
