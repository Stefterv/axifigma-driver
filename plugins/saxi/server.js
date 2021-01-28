import saxi from "saxi";

export default async function(args) {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  if (this.nuxt.options._build && !this.options.dev) return;
  saxi.server.startServer(this.nuxt.options.saxiPort);
}
