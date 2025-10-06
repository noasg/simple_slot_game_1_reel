import { ReelModel } from "../model/ReelModel";
import { SpinButton } from "../View/SpinButtonView";
import { ReelView } from "../View/ReelView";
import * as PIXI from "pixi.js";
export class GameController {
  private reel: ReelModel;
  private button: SpinButton;
  private message: PIXI.Text;
  private reelView: ReelView;
  private isSpinning: boolean = false;
  private currentResult: { symbols: string[] } | null = null;

  constructor(
    reel: ReelModel,
    button: SpinButton,
    message: PIXI.Text,
    reelView: ReelView
  ) {
    this.reel = reel;
    this.button = button;
    this.message = message;
    this.reelView = reelView;

    this.button.setCallback(this.handleSpin.bind(this));
  }

  private handleSpin() {
    if (this.isSpinning) {
      console.log("⚠️ Force stopping current spin");
      if (this.currentResult) {
        this.reelView.forceStop(this.currentResult.symbols); // ✅ keep same result
        this.isSpinning = false;
      }
      return;
    }

    // ✅ Only generate spin result when starting a NEW spin
    this.currentResult = this.reel.spin();
    this.isSpinning = true;

    console.log("Next 3 symbols:", this.currentResult.symbols);
    this.message.text = `  ${this.currentResult.symbols.join(" | ")}`;

    this.reelView.spin(this.currentResult.symbols, 1000, () => {
      this.isSpinning = false;
      console.log("✅ Spin finished");
    });
  }
}
