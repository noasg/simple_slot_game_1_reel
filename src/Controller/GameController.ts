// controller/GameController.ts
import { ReelModel } from "../model/ReelModel";
import { SpinButton } from "../View/SpinButtonView";
import { ReelView } from "../View/ReelView";
import { weelSpinDuration } from "../utils/Constants";
import * as PIXI from "pixi.js";

export class GameController {
  private reel: ReelModel;
  private button: SpinButton;
  private message: PIXI.Text;
  private reelView: ReelView;
  private isSpinning: boolean = false;
  private currentResult: { symbols: string[] } | null = null;
  private ui: any;

  constructor(
    reel: ReelModel,
    button: SpinButton,
    message: PIXI.Text,
    reelView: ReelView,
    ui?: any
  ) {
    this.reel = reel;
    this.button = button;
    this.message = message;
    this.reelView = reelView;
    this.ui = ui;

    this.button.setCallback(this.handleSpin.bind(this));

    // Show initial balance and spin cost
    this.ui?.updateBalance(this.reel.getBalance());
  }

  private handleSpin() {
    if (this.isSpinning) {
      console.log("Force stopping current spin");
      if (this.currentResult) {
        this.reelView.forceStop(this.currentResult.symbols, () => {
          this.isSpinning = false;

          const winAmount = this.calculateWin(this.currentResult!.symbols);
          this.reel.addWin(winAmount);
          this.ui?.updateBalance(this.reel.getBalance());

          this.message.text =
            winAmount > 0
              ? `🎉 You won €${winAmount}!`
              : "😢 No win this time.";

          // Disable button if balance is 0 after force stop
          this.button.setEnabled(this.reel.canSpin());
        });
      }
      return;
    }

    if (!this.reel.canSpin()) {
      this.message.text = "❌ Not enough balance!";
      this.button.setEnabled(false);
      return;
    }

    // Deduct cost for normal spin
    this.reel.deductSpinCost();
    this.ui?.updateBalance(this.reel.getBalance());

    this.reelView.hideWinBgs();

    this.currentResult = this.reel.spin();
    this.isSpinning = true;

    this.message.text = "Spinning...";
    this.button.setEnabled(true); // allow force stop during spin

    this.reelView.spin(this.currentResult.symbols, weelSpinDuration, () => {
      this.isSpinning = false;

      const winAmount = this.calculateWin(this.currentResult!.symbols);
      this.reel.addWin(winAmount);
      this.ui?.updateBalance(this.reel.getBalance());

      this.message.text =
        winAmount > 0 ? `🎉 You won €${winAmount}!` : "😢 No win this time.";

      // Disable button if balance is 0 after normal spin
      this.button.setEnabled(this.reel.canSpin());
    });
  }

  private calculateWin(symbols: string[]): number {
    const [a, b, c] = symbols;
    if (a === b && b === c) return 3; // triple win
    if (a === b || b === c || a === c) return 2; // double win
    return 0; // no win
  }
}
