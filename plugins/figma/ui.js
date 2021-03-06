import Vue from "vue";
import UI from "./components/ui";
import "~/style/global.scss";

new Vue({
  el: "#app",
  extends: UI,
});
window.onmessage = async (msg) => {
  console.log("UI recieved", msg.data, msg);
  if (msg.origin != "https://www.figma.com") {
    window.parent.postMessage(msg.data, "*");
  } else {
    if (!window.frames.length) return;
    let nuxt = window.frames[0];

    nuxt.postMessage(msg.data, "*");
  }
};
