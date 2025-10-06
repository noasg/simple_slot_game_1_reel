// ReelView.ts
import * as PIXI from "pixi.js";
import { createBackground, createMask } from "../utils/ReelLayoutFactory";
import { createSpinSequence } from "../utils/ReelUtils";
import { createSymbolSprite } from "../utils/SymbolFactory";
import { animateReel } from "../utils/ReelAnimator";
import { createWinBgs } from "../utils/WinBgFactory";
import { borderSize } from "../utils/Constants";
import { WinManager } from "../utils/WinManager";

export class ReelView extends PIXI.Container {
  private background: PIXI.Sprite;
  private symbolSprites: PIXI.Sprite[] = [];
  private reelWidth: number;
  private slotHeight: number;
  private reelMask: PIXI.Graphics;
  private spinTicker?: PIXI.Ticker;
  private isSpinning = false;
  private borderSize = borderSize;
  private winBgs: PIXI.Sprite[] = [];
  private winBgTimeout?: number;
  private winManager: WinManager;

  constructor(
    bgTexture: PIXI.Texture,
    initialSymbols: string[],
    reelWidth: number,
    reelHeight: number
  ) {
    super();
    this.reelWidth = reelWidth;
    this.slotHeight = reelHeight / 3; // only used locally

    // background & mask
    this.background = createBackground(bgTexture, reelWidth, reelHeight);
    this.addChild(this.background);

    this.reelMask = createMask(reelWidth, reelHeight, this.borderSize);
    this.addChild(this.reelMask);

    // initial reel
    this.createFullReel(initialSymbols);
    this.layoutSymbols();

    this.winBgs = createWinBgs(
      PIXI.Loader.shared.resources["win_bg"].texture!,
      reelWidth,
      reelHeight / 3,
      5
    );
    this.winManager = new WinManager(this.winBgs);
    this.winBgs.forEach((bg) => this.addChildAt(bg, 1));
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
      sprite.y = i * this.slotHeight + (this.slotHeight - sprite.height) / 2;
    });
  }

  spin(finalSymbols: string[], duration: number, callback?: () => void) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    // collect current top 3 symbols
    const currentSymbols = this.symbolSprites
      .slice(0, 3)
      .map(
        (s) =>
          Object.keys(PIXI.Loader.shared.resources).find(
            (key) => PIXI.Loader.shared.resources[key].texture === s.texture
          ) || "SYM01"
      );

    console.log("Current top 3 symbols:", currentSymbols, finalSymbols);

    // build spin sequence (includes extra symbols for smooth drop)
    const spinSequence = createSpinSequence(currentSymbols, finalSymbols, 14);
    console.log("spinSequence", spinSequence);

    // keep old symbols
    const oldSprites = this.symbolSprites.slice();

    // create new symbols above mask
    const newSprites: PIXI.Sprite[] = [];
    spinSequence.forEach((symbol, i) => {
      const sprite = createSymbolSprite(
        symbol,
        this.reelWidth,
        this.slotHeight,
        0,
        -i * this.slotHeight, // start above mask
        this.reelMask
      );
      if (sprite) {
        this.addChild(sprite);
        newSprites.push(sprite);
      }
    });

    // combine old + new symbols for animation
    const allSprites = [...oldSprites, ...newSprites];

    const finalOffset = spinSequence.length * this.slotHeight;

    this.spinTicker?.stop();
    this.spinTicker = animateReel(
      allSprites,
      this.slotHeight,

      finalOffset,
      duration,
      () => this.finishSpin(finalSymbols, callback)
    );

    // keep reference for tracking
    this.symbolSprites = allSprites;
  }

  forceStop(finalSymbols: string[]) {
    if (!this.isSpinning) return;

    // stop ticker immediately
    this.spinTicker?.stop();

    // hide any win backgrounds immediately
    this.winManager.hideWinBgs();

    // finish immediately with final symbols
    this.finishSpin(finalSymbols);
  }

  public hideWinBgs() {
    if (this.winBgTimeout) {
      clearTimeout(this.winBgTimeout);
      this.winBgTimeout = undefined;
    }
    this.winBgs.forEach((bg) => (bg.visible = false));
  }

  private finishSpin(finalSymbols: string[], callback?: () => void) {
    // remove all current symbols
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
    this.winManager.checkWin(finalSymbols);
    this.isSpinning = false;
    callback?.();
  }
}
