import Vue from "vue";
import UI from "./components/ui";

let vm = new Vue({
  el: "#app",
  extends: UI,
});
window.onmessage = async (msg) => {
  console.log("UI recieved", msg);
  if (msg.source != window.parent) {
    window.parent.postMessage(msg.data, "*");
  } else {
    if (!window.frames.length) return;
    let nuxt = window.frames[0];

    nuxt.postMessage(msg.data.pluginMessage, "*");
  }
};
