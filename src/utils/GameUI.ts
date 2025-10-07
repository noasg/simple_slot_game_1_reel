import * as PIXI from "pixi.js";
import { initialSpinText, spinValue } from "./Constants";
import { balanceText, curencySymbol } from "./Constants";
export class GameUI {
  public message: PIXI.Text; // Text showing current game status (e.g., spinning, win, lose)
  public border: PIXI.Graphics; // Decorative border around the game area
  public balanceText: PIXI.Text; // Text showing player's current balance
  public spinCostText: PIXI.Text; // Text showing cost per spin

  constructor(app: PIXI.Application, gameWidth: number, gameHeight: number) {
    // Message Text
    this.message = new PIXI.Text(initialSpinText, {
      fontFamily: "Arial",
      fontSize: 16,
      fill: 0xffffff,
    });
    this.message.anchor.set(0.5);
    this.message.x = gameWidth / 2;
    this.message.y = 30;
    app.stage.addChild(this.message);

    // Balance text
    this.balanceText = new PIXI.Text("", {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0x00ff00,
    });
    this.balanceText.x = 20;
    this.balanceText.y = 10;
    app.stage.addChild(this.balanceText);

    // Spin Cost Text
    this.spinCostText = new PIXI.Text(spinValue, {
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

  //Update the balance displayed on screen
  updateBalance(amount: number) {
    this.balanceText.text = balanceText + `${amount}` + curencySymbol;
    this.balanceText.style.fill = amount <= 0 ? 0xff0000 : 0x00ff00;
  }
}
