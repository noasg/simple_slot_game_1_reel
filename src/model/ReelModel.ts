// model/ReelModel.ts
import type { SymbolsPath } from "./SymbolsPath";
import { initialAmmount, spinCost } from "../utils/Constants";
export class ReelModel {
  private symbols: string[];
  private balance: number;
  private spinCost: number;

  constructor(
    symbolsOrder: SymbolsPath,
    startingBalance: number = initialAmmount,
    spinCostValue: number = spinCost
  ) {
    this.symbols = symbolsOrder.getSymbols();
    this.balance = startingBalance;
    this.spinCost = spinCostValue;
  }

  getBalance(): number {
    return this.balance;
  }

  getSpinCost(): number {
    return this.spinCost;
  }

  canSpin(): boolean {
    return this.balance >= this.spinCost;
  }

  deductSpinCost(): void {
    if (!this.canSpin()) throw new Error("Insufficient balance");
    this.balance -= this.spinCost;
  }

  addWin(amount: number): void {
    this.balance += amount;
  }

  // simulate a spin → returns next 3 symbols
  spin(): { position: number; symbols: string[] } {
    const start = Math.floor(Math.random() * this.symbols.length);
    const nextSymbols = [
      this.symbols[start % this.symbols.length],
      this.symbols[(start + 1) % this.symbols.length],
      this.symbols[(start + 2) % this.symbols.length],
    ];
    return { position: start, symbols: nextSymbols };
  }
}
