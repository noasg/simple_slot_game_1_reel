import * as PIXI from "pixi.js";

export class GameUI {
  public message: PIXI.Text;
  public border: PIXI.Graphics;
  public balanceText: PIXI.Text;
  public spinCostText: PIXI.Text;

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

    // Balance text
    this.balanceText = new PIXI.Text("rewasdasd", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0x00ff00,
    });
    this.balanceText.x = 20;
    this.balanceText.y = 10;
    app.stage.addChild(this.balanceText);

    // Spin cost info
    this.spinCostText = new PIXI.Text("Spin cost: €1", {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffcc00,
    });
    this.spinCostText.x = gameWidth - 150;
    this.spinCostText.y = 10;
    app.stage.addChild(this.spinCostText);

    // Border
    this.border = new PIXI.Graphics();
    this.border.lineStyle(4, 0x00ff00);
    this.border.drawRect(0, 0, gameWidth, gameHeight);
    app.stage.addChild(this.border);
  }

  updateBalance(amount: number) {
    this.balanceText.text = `Balance: €${amount}`;
    this.balanceText.style.fill = amount <= 0 ? 0xff0000 : 0x00ff00;
  }
}
