import * as PIXI from "pixi.js";

export class GameUI {
  public message: PIXI.Text;
  public border: PIXI.Graphics;

  constructor(app: PIXI.Application, gameWidth: number, gameHeight: number) {
    // Message
    this.message = new PIXI.Text("Ready!", {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xffffff,
    });
    this.message.anchor.set(0.5);
    this.message.x = gameWidth / 2;
    this.message.y = 30;
    app.stage.addChild(this.message);

    // Border
    this.border = new PIXI.Graphics();
    this.border.lineStyle(4, 0xffff00);
    this.border.drawRect(0, 0, gameWidth, gameHeight);
    app.stage.addChild(this.border);
  }
}
