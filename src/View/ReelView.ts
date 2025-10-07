import * as PIXI from "pixi.js";
import { createBackground, createMask } from "../utils/ReelLayoutFactory";
import { createSpinSequence } from "../utils/ReelUtils";
import { createSymbolSprite } from "../utils/SymbolFactory";
import { animateReel } from "../utils/ReelAnimator";
import { createWinBgs } from "../utils/WinBgFactory";
import { borderSize } from "../utils/Constants";
import { WinManager } from "../utils/WinManager";

// ReelView - Handles the visual representation of a single slot machine reel.
// - Displays symbols
// - Animates spins
// - Shows win backgrounds

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
    this.slotHeight = reelHeight / 3; // Each slot height (3 visible symbols)

    // Create background
    this.background = createBackground(bgTexture, reelWidth, reelHeight);
    this.addChild(this.background);

    // Create mask to limit visible area
    this.reelMask = createMask(reelWidth, reelHeight, this.borderSize);
    this.addChild(this.reelMask);

    // Create mask to limit visible area
    this.createFullReel(initialSymbols);
    this.layoutSymbols();

    // Create win backgrounds and WinManager
    this.winBgs = createWinBgs(
      PIXI.Loader.shared.resources["win_bg"].texture!,
      reelWidth,
      reelHeight / 3,
      5
    );
    this.winManager = new WinManager(this.winBgs);
    this.winBgs.forEach((bg) => this.addChildAt(bg, 1));
  }

  // Fill the reel with repeated symbols (to allow smooth spinning)
  private createFullReel(symbols: string[]) {
    // Remove old sprites
    this.symbolSprites.forEach((s) => this.removeChild(s));
    this.symbolSprites = [];

    const repeatCount = 4; // repeat symbols to fill reel for animation
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

  //Align symbols vertically in the reel
  private layoutSymbols() {
    this.symbolSprites.forEach((sprite, i) => {
      sprite.y = i * this.slotHeight + (this.slotHeight - sprite.height) / 2;
    });
  }

  //Animate a spin to reach the finalSymbols
  spin(finalSymbols: string[], duration: number, callback?: () => void) {
    if (this.isSpinning) return;
    this.isSpinning = true;

    // Get current top 3 symbols
    const currentSymbols = this.symbolSprites
      .slice(0, 3)
      .map(
        (s) =>
          Object.keys(PIXI.Loader.shared.resources).find(
            (key) => PIXI.Loader.shared.resources[key].texture === s.texture
          ) || "SYM01"
      );

    console.log("Current top 3 symbols:", currentSymbols, finalSymbols);

    // Build a spin sequence (current + random middle + final symbols)
    const spinSequence = createSpinSequence(currentSymbols, finalSymbols, 17);
    console.log("spinSequence", spinSequence);

    // keep old symbols
    const oldSprites = this.symbolSprites.slice();

    // Create new sprites above the visible mask
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

    // Start reel animation
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

  //Force stop an ongoing spin
  forceStop(finalSymbols: string[], callback?: () => void) {
    if (!this.isSpinning) return;

    // stop ticker immediately
    this.spinTicker?.stop();

    // hide any win backgrounds immediately
    this.winManager.hideWinBgs();

    // finish immediately with final symbols
    this.finishSpin(finalSymbols, callback);
  }

  // hides all win backgrounds
  public hideWinBgs() {
    if (this.winBgTimeout) {
      clearTimeout(this.winBgTimeout);
      this.winBgTimeout = undefined;
    }
    this.winBgs.forEach((bg) => (bg.visible = false));
  }

  // Finalize a spin: sets final symbols, shows wins, and calls callback
  private finishSpin(finalSymbols: string[], callback?: () => void) {
    // remove all current symbols
    this.symbolSprites.forEach((s) => this.removeChild(s));
    this.symbolSprites = [];
    // Add final symbols
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
    // Check for wins
    this.winManager.checkWin(finalSymbols);
    this.isSpinning = false;
    callback?.();
  }
}
