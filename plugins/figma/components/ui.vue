<template>
  <div>Vue here<iframe :src="`http://127.0.0.1:${nuxtPort}`"></iframe></div>
</template>

<script>
let loaded = false;
import { nuxtPort } from "~/nuxt.config";
export default {
  data() {
    return {
      nuxtPort,
    };
  },
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
iframe {
  width: 100%;
  height: 100%;
  border: 0;
}
</style>