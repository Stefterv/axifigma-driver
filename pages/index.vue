<template>
  <div>Hello</div>
</template>

<script>
export default {
  mounted() {
    console.log("Mounted Vue");
    window.parent.postMessage({ pluginMessage: "Hello!" }, "*");
    window.onmessage = (msg) => {
      console.log("Nuxt recieved", msg);
    };
  },
};
</script>

<style>
html {
  background: red;
}
</style>