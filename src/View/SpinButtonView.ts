import * as PIXI from "pixi.js";

export class SpinButton extends PIXI.Container {
  private playSprite: PIXI.Sprite;
  private disabledSprite: PIXI.Sprite;
  private clickCallback: () => void = () => {};
  private enabled: boolean = true;

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
    if (!this.enabled) return;
    this.clickCallback();
  }

  public setEnabled(value: boolean) {
    this.enabled = value;
    this.playSprite.visible = value;
    this.disabledSprite.visible = !value;

    // adjust interactivity
    this.interactive = value;
    this.buttonMode = value;
  }
}
