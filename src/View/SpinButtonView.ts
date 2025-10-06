import * as PIXI from "pixi.js";

export class SpinButton extends PIXI.Container {
  private playSprite: PIXI.Sprite;
  private disabledSprite: PIXI.Sprite;
  private clickCallback: () => void = () => {};

  constructor(
    playTexture: PIXI.Texture,
    disabledTexture: PIXI.Texture,
    width: number = 150,
    height: number = 50
  ) {
    super();

    this.playSprite = new PIXI.Sprite(playTexture);
    this.disabledSprite = new PIXI.Sprite(disabledTexture);

    this.playSprite.width = width;
    this.playSprite.height = height;
    this.disabledSprite.width = width;
    this.disabledSprite.height = height;

    // only show playSprite by default
    this.disabledSprite.visible = false;

    this.addChild(this.playSprite, this.disabledSprite);

    this.interactive = true;
    this.buttonMode = true;
    this.on("pointerdown", this.onClick.bind(this));
  }

  setCallback(callback: () => void) {
    this.clickCallback = callback;
  }

  private onClick() {
    // Just fire the callback — no disable/enable logic anymore
    this.clickCallback();
  }

  // Optional: if you still want to visually toggle between enabled/disabled
  // without blocking input, you could add a method:
  public setVisualState(isActive: boolean) {
    this.playSprite.visible = isActive;
    this.disabledSprite.visible = !isActive;
  }
}
