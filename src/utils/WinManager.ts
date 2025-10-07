import * as PIXI from "pixi.js";

// Handles displaying and hiding win highlight backgrounds
export class WinManager {
  private winBgs: PIXI.Sprite[];
  private timeout?: number;

  constructor(winBgs: PIXI.Sprite[]) {
    this.winBgs = winBgs;
  }

  //Highlights winning symbols based on the final symbols.
  public checkWin(finalSymbols: string[]) {
    //hide all previous win highlights
    this.hideWinBgs();

    // Count occurrences of each symbol
    const counts: Record<string, number> = {};
    finalSymbols.forEach((s) => (counts[s] = (counts[s] || 0) + 1));

    // Highlight slots that are part of a "win"
    finalSymbols.forEach((s, i) => {
      if (counts[s] >= 2) this.winBgs[i].visible = true;
    });

    // Automatically hide win backgrounds after 1.5 seconds
    this.timeout = window.setTimeout(() => {
      this.hideWinBgs();
    }, 1500);
  }

  // Automatically hide win backgrounds after 1.5 seconds
  public hideWinBgs() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.winBgs.forEach((bg) => (bg.visible = false));
  }
}
