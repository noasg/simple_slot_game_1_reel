import * as PIXI from "pixi.js";

export class CanvasResize {
  /**
   * Resize a PIXI canvas to fit the window with a margin and keep aspect ratio
   * @param app PIXI.Application
   * @param gameWidth Width of the game scene
   * @param gameHeight Height of the game scene
   * @param margin Optional margin as fraction of window width (default 0.1 = 10%)
   */
  static resizeCanvas(
    app: PIXI.Application,
    gameWidth: number,
    gameHeight: number,
    margin: number = 0.1
  ) {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const usableWidth = windowWidth * (1 - margin * 2); // left + right margin
    const usableHeight = windowHeight;

    const scale = Math.min(usableWidth / gameWidth, usableHeight / gameHeight);

    app.view.style.width = `${gameWidth * scale}px`;
    app.view.style.height = `${gameHeight * scale}px`;
    app.view.style.position = "absolute";
    app.view.style.left = "50%";
    app.view.style.top = "50%";
    app.view.style.transform = "translate(-50%, -50%)";
  }

  /**
   * Attach resize event to automatically adjust PIXI canvas
   */
  static attachResizeListener(
    app: PIXI.Application,
    gameWidth: number,
    gameHeight: number,
    margin: number = 0.1
  ) {
    window.addEventListener("resize", () => {
      CanvasResize.resizeCanvas(app, gameWidth, gameHeight, margin);
    });
    // initial call
    CanvasResize.resizeCanvas(app, gameWidth, gameHeight, margin);
  }
}
