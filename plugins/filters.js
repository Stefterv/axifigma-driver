import humanize from "humanize-duration";
import Vue from "vue";

export default function() {
  Vue.filter("humanize", (value) =>
    humanize(value, {
      round: true,
      language: "shortEn",
      languages: {
        shortEn: {
          y: () => "year",
          mo: () => "mo",
          w: () => "week",
          d: () => "day",
          h: () => "hour",
          m: () => "min",
          s: () => "sec",
          ms: () => "ms",
        },
      },
    })
  );
}
