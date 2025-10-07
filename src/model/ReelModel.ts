import type { SymbolsPath } from "./SymbolsPath";
import { initialAmmount, spinCost } from "../utils/Constants";

export class ReelModel {
  private symbols: string[]; // The ordered set of symbols on the reel
  private balance: number; // Current player balance
  private spinCost: number; // Cost per spin

  constructor(
    symbolsOrder: SymbolsPath,
    startingBalance: number = initialAmmount,
    spinCostValue: number = spinCost
  ) {
    this.symbols = symbolsOrder.getSymbols(); // Load symbols from provided path
    this.balance = startingBalance; // Initial player balance (default from constants)
    this.spinCost = spinCostValue; // Cost per spin (default from constants)
  }

  //the current player balance
  getBalance(): number {
    return this.balance;
  }

  //the cost to spin the reel
  getSpinCost(): number {
    return this.spinCost;
  }

  //check if the player can spin (balance >= spin cost)
  canSpin(): boolean {
    return this.balance >= this.spinCost;
  }

  //deduct the spin cost from the balance.
  deductSpinCost(): void {
    if (!this.canSpin()) throw new Error("Insufficient balance");
    this.balance -= this.spinCost;
  }

  //add the win amount to the balance.
  addWin(amount: number): void {
    this.balance += amount;
  }

  // Simulate a spin.
  // Randomly selects 3 consecutive symbols from the reel.
  // The Controller will use these symbols to animate the reel in the View.
  spin(): { position: number; symbols: string[] } {
    const start = Math.floor(Math.random() * this.symbols.length);

    // Pick 3 symbols starting from random start index, wrap around the reel
    const nextSymbols = [
      this.symbols[start % this.symbols.length],
      this.symbols[(start + 1) % this.symbols.length],
      this.symbols[(start + 2) % this.symbols.length],
    ];
    return { position: start, symbols: nextSymbols };
  }
}
