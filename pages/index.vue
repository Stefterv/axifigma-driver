<template>
  <div>
    {{ $saxi.state.connected ? "Connected" : "No connection" }}
    <button @click="plan" v-if="$saxi.state.plan">Plot!</button>
    <pre>{{ $saxi.state }}</pre>
  </div>
</template>

<script>
export default {
  mounted() {
    // window.parent.postMessage({ pluginMessage: "Hello!" }, "*");
    // window.onmessage = (msg) => {
    //   console.log("Nuxt recieved", msg);
    // };
  },
  methods: {
    plan() {
      this.$saxi.submitPlan();
    },
  },
};
</script>

<style></style>
