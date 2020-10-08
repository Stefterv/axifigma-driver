

<script>
import Alive from "~/components/saxi/alive";
import { saxiPort } from "~/nuxt.config";

export default {
  extends: Alive,
  methods: {
    websocket() {
      return new WebSocket(`ws://127.0.0.1:${saxiPort}`);
    },
  },
};
</script>