import humanize from "humanize-duration";
import Vue from "vue";

export default function() {
  Vue.filter("humanize", (value) => humanize(value, { round: true }));
}
