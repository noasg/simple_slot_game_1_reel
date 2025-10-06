// ReelView.ts
import * as PIXI from "pixi.js";
import { createBackground, createMask } from "../utils/ReelLayoutFactory";
import { createSpinSequence } from "../utils/ReelUtils";
import { createSymbolSprite } from "../utils/SymbolFactory";
import { animateReel } from "../utils/ReelAnimator";

export class ReelView extends PIXI.Container {
  private background: PIXI.Sprite;
  private symbolSprites: PIXI.Sprite[] = [];
  private reelWidth: number;
  private reelHeight: number;
  private slotHeight: number;
  private reelMask: PIXI.Graphics;
  private spinTicker?: PIXI.Ticker;
  private isSpinning = false;
  private borderSize = 5;

  constructor(
    bgTexture: PIXI.Texture,
    initialSymbols: string[],
    reelWidth: number,
    reelHeight: number
  ) {
    super();
    this.reelWidth = reelWidth;
    this.reelHeight = reelHeight;
    this.slotHeight = reelHeight / 3;

    // background & mask
    this.background = createBackground(bgTexture, reelWidth, reelHeight);
    this.addChild(this.background);

    this.reelMask = createMask(reelWidth, reelHeight, this.borderSize);
    this.addChild(this.reelMask);

    // initial reel
    this.createFullReel(initialSymbols);
    this.layoutSymbols();
  }

  private createFullReel(symbols: string[]) {
    this.symbolSprites.forEach((s) => this.removeChild(s));
    this.symbolSprites = [];

    const repeatCount = 4;
    for (let r = 0; r < repeatCount; r++) {
      symbols.forEach((symbol, i) => {
        const sprite = createSymbolSprite(
          symbol,
          this.reelWidth,
          this.slotHeight,
          0,
          (r * symbols.length + i) * this.slotHeight,
          this.reelMask
        );
        if (sprite) {
          this.addChild(sprite);
          this.symbolSprites.push(sprite);
        }
      });
    }
  }

  private layoutSymbols() {
    this.symbolSprites.forEach((sprite, i) => {
      sprite.y = i * this.slotHeight;
    });
  }

  spin(finalSymbols: string[], duration: number, callback?: () => void) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    // collect current top 3
    const currentSymbols = this.symbolSprites
      .slice(0, 3)
      .map(
        (s) =>
          Object.keys(PIXI.Loader.shared.resources).find(
            (key) => PIXI.Loader.shared.resources[key].texture === s.texture
          ) || "SYM01"
      );

    // build sequence
    const spinSequence = createSpinSequence(currentSymbols, finalSymbols, 20);

    // rebuild symbols
    this.symbolSprites.forEach((s) => this.removeChild(s));
    this.symbolSprites = [];
    spinSequence.forEach((symbol, i) => {
      const sprite = createSymbolSprite(
        symbol,
        this.reelWidth,
        this.slotHeight,
        0,
        i * this.slotHeight,
        this.reelMask
      );
      if (sprite) {
        this.addChild(sprite);
        this.symbolSprites.push(sprite);
      }
    });

    const totalHeight = this.symbolSprites.length * this.slotHeight;
    const visibleCount = 3;
    const finalOffset = (spinSequence.length - visibleCount) * this.slotHeight;

    this.spinTicker?.stop();
    this.spinTicker = animateReel(
      this.symbolSprites,
      this.slotHeight,
      totalHeight,
      finalOffset,
      duration,
      () => this.finishSpin(finalSymbols, callback)
    );
  }

  forceStop(finalSymbols: string[]) {
    if (!this.isSpinning) return;

    // stop ticker if it's animating
    this.spinTicker?.stop();

    // finish immediately with final symbols
    this.finishSpin(finalSymbols);
  }

  private finishSpin(finalSymbols: string[], callback?: () => void) {
    this.symbolSprites.forEach((s) => this.removeChild(s));
    this.symbolSprites = [];

    finalSymbols.forEach((s, i) => {
      const sprite = createSymbolSprite(
        s,
        this.reelWidth,
        this.slotHeight,
        0,
        this.borderSize + i * this.slotHeight,
        this.reelMask
      );
      if (sprite) {
        this.addChild(sprite);
        this.symbolSprites.push(sprite);
      }
    });

    this.isSpinning = false;
    callback?.();
  }
}
