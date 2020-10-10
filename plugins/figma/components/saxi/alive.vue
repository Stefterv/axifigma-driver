<script>
import Alive from "~/components/saxi/alive";
import { saxiPort, nuxtPort } from "~/nuxt.config";
import axios from "axios";

export default {
  extends: Alive,
  methods: {
    async http() {
      try {
        let { status } = await axios.get(`http://127.0.0.1:${nuxtPort}/saxi/`);
        return status == 200;
      } catch (err) {
        console.error(err);
        return false;
      }
    },
    isServer() {
      return false;
    },
    async createSocket() {
      try {
        this.socket = new WebSocket(`ws://127.0.0.1:${saxiPort}`);
        this.socket.onerror = (err) => {};
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};
</script>
