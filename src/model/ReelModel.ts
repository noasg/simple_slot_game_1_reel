import type { SymbolsPath } from "../utils/SymbolsPath";

export class ReelModel {
  private symbols: string[];

  constructor(symbolsOrder: SymbolsPath) {
    this.symbols = symbolsOrder.getSymbols();
    console.log("ReelModel initialized with symbols:", this.symbols);
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
