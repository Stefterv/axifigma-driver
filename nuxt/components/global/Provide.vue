<script>
export default {
  provide() {
    return this.$attrs;
  },
  render() {
    if (!this.$scopedSlots.default) return;
    return this.$scopedSlots.default({});
  },
};
</script>
