const cbs = {};

export default function registerMessage(type, cb) {
  cbs[type] = cb;
}
figma.ui.onmessage = (msg) => {
  console.log("Figma recieved", msg);
  for (let type in cbs) {
    if (msg.type !== type) continue;

    cbs[type](msg);
  }
};
