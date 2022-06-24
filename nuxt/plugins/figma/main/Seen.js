const key = "driver:seen";
export default class Seen {
  static async display() {
    let seen = await figma.clientStorage.getAsync(key);
    if (!seen) return;
    figma.ui.postMessage({ seen });
  }
  static async trigger() {
    figma.clientStorage.setAsync(key, true);
  }
}
