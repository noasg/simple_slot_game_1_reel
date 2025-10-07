import { ReelModel } from "../model/ReelModel";
import { SpinButton } from "../View/SpinButtonView";
import { ReelView } from "../View/ReelView";
import { emptyBalanceText, weelSpinDuration } from "../utils/Constants";
import {
  winTextPrefix,
  curencySymbol,
  loseText,
  spinText,
} from "../utils/Constants";
import * as PIXI from "pixi.js";

export class GameController {
  private reel: ReelModel; // The game logic (reel symbols, balance, spin)
  private button: SpinButton; // Spin button View
  private message: PIXI.Text; // Text UI for showing messages to player
  private reelView: ReelView; // Reel View (the spinning reels)
  private isSpinning: boolean = false; // Tracks if a spin is currently happening
  private currentResult: { symbols: string[] } | null = null; // Current spin result
  private ui: any; // Optional GameUI reference for balance update

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

    // Attach button click callback to this controller
    this.button.setCallback(this.handleSpin.bind(this));

    // Display the initial balance in the UI
    this.ui?.updateBalance(this.reel.getBalance());
  }

  // Called when the spin button is pressed.
  // Handles normal spins and "force stop" spins.

  private handleSpin() {
    // === Force stop logic ===
    if (this.isSpinning) {
      console.log("Force stopping current spin");
      if (this.currentResult) {
        this.reelView.forceStop(this.currentResult.symbols, () => {
          this.isSpinning = false;

          // Calculate winnings immediately
          const winAmount = this.calculateWin(this.currentResult!.symbols);
          this.reel.addWin(winAmount);

          // Update UI balance
          this.ui?.updateBalance(this.reel.getBalance());

          // Update message depending on win/loss
          this.updateSpinMessage(winAmount);

          // If balance is 0 after force stop, disable the spin button
          this.button.setEnabled(this.reel.canSpin());
        });
      }
      return;
    }

    // === Check if player has enough balance for a normal spin ===
    if (!this.reel.canSpin()) {
      this.message.text = emptyBalanceText;
      this.button.setEnabled(false);
      return;
    }

    // Deduct spin cost for normal spin
    this.reel.deductSpinCost();
    this.ui?.updateBalance(this.reel.getBalance());

    // Hide previous win highlights
    this.reelView.hideWinBgs();

    // Hide previous win highlights
    this.currentResult = this.reel.spin();
    this.isSpinning = true;

    // Show "Good luck" message -> during spin
    this.message.text = spinText;

    // Enable button to allow force-stop during spinning
    this.button.setEnabled(true);

    // Animate the reel
    this.reelView.spin(this.currentResult.symbols, weelSpinDuration, () => {
      this.isSpinning = false;

      // Calculate win after spin completes
      const winAmount = this.calculateWin(this.currentResult!.symbols);
      this.reel.addWin(winAmount);
      this.ui?.updateBalance(this.reel.getBalance());

      // Update message with win/loss
      this.updateSpinMessage(winAmount);

      // Disable button if balance is 0 after normal spin
      this.button.setEnabled(this.reel.canSpin());
    });
  }

  //Determines how much the player won based on 3 symbols
  // Returns 3 for triple match, 2 for double match, 0 for no match
  private calculateWin(symbols: string[]): number {
    const [a, b, c] = symbols;
    if (a === b && b === c) return 3; // triple win
    if (a === b || b === c || a === c) return 2; // double win
    return 0; // no win
  }

  //Updates the on-screen message based on the win amount
  private updateSpinMessage(winAmount: number) {
    this.message.text =
      winAmount > 0 ? winTextPrefix + `${winAmount}` + curencySymbol : loseText;
  }
}
