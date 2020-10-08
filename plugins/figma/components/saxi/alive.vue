

<script>
import Alive from "~/components/saxi/alive";
import { saxiPort, nuxtPort } from "~/nuxt.config";
import axios from "axios";

export default {
  extends: Alive,
  methods: {
    async http() {
      return true;
    },
    isServer() {
      return false;
    },
    createSocket() {
      try {
        this.socket = new WebSocket(`ws://127.0.0.1:${saxiPort}`);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
</script>