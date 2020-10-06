import saxi from "saxi";

export default async function() {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  saxi.server.startServer(9090);
}
