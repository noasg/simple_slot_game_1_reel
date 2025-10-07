import * as PIXI from "pixi.js";

// Load all game assets and invoke callback when finished.
export class AssetLoader {
  static loadAssets(callback: () => void) {
    const loader = PIXI.Loader.shared;
    PIXI.Loader.shared
      .add("play", "assets/PLAY.png")
      .add("play_disabled", "assets/PLAY_DISABLED.png")
      .add("reel", "assets/REEL.png");

    for (let i = 1; i <= 6; i++) {
      const name = `SYM0${i}`;
      loader.add(name, `assets/${name}.png`);
    }

    loader.load(callback);
  }
}
