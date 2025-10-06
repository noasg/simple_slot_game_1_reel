import * as PIXI from "pixi.js";

export class WinManager {
  private winBgs: PIXI.Sprite[];
  private timeout?: number;

  constructor(winBgs: PIXI.Sprite[]) {
    this.winBgs = winBgs;
  }

  public checkWin(finalSymbols: string[]) {
    this.hideWinBgs();

    const counts: Record<string, number> = {};
    finalSymbols.forEach((s) => (counts[s] = (counts[s] || 0) + 1));

    finalSymbols.forEach((s, i) => {
      if (counts[s] >= 2) this.winBgs[i].visible = true;
    });

    this.timeout = window.setTimeout(() => {
      this.hideWinBgs();
    }, 1500);
  }

  public hideWinBgs() {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = undefined;
    }
    this.winBgs.forEach((bg) => (bg.visible = false));
  }
}
