import * as PIXI from "pixi.js";

//Generates a full symbol sequence for a reel spin
//The sequence contains:
// 1. current visible symbols (so animation starts smoothly)
// 2. random "middle" symbols for spinning effect
// 3. final symbols that should appear after the spin stops

export function createSpinSequence(
  currentSymbols: string[],
  finalSymbols: string[],
  middleCount: number
): string[] {
  const allSymbolsKeys = Object.keys(PIXI.Loader.shared.resources).filter((k) =>
    /^SYM\d{2}$/.test(k)
  );

  return [
    ...currentSymbols, // keep current symbols at the top
    ...Array.from(
      { length: middleCount },
      () => allSymbolsKeys[Math.floor(Math.random() * allSymbolsKeys.length)] // random middle symbols
    ),
    ...finalSymbols.map(
      (s) => `SYM${s.match(/\d+/)?.[0].padStart(2, "0") || "01"}` //final symbols normalized
    ),
  ];
}

//animation types
export function linear(t: number): number {
  return t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
