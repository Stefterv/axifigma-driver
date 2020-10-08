<template>
  <div>Test</div>
</template>

<script>
export default {
  data() {},
  mounted() {
    checkPageLoaded();
    async function checkPageLoaded() {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      if (loaded) return;

      openDriverPage();
    }

    function openDriverPage() {
      window.open("https://axifigma.steftervel.de");
    }
    window.onmessage = async (msg) => {
      console.log("UI recieved", msg);
      if (msg.source != window.parent) {
        window.parent.postMessage(msg.data, "*");
        loaded = true;
      } else {
        let nuxt = window.frames[0];

        nuxt.postMessage(msg.data.pluginMessage, "*");
      }
    };
  },
};
</script>

<style>
</style>