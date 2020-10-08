import Vue from "vue";
import UI from "./components/ui";
import VueCookies from "vue-cookies";

let vm = new Vue({
  el: "#app",
  extends: UI,
});

Vue.use(VueCookies);
Vue.$cookies.config("7d");
