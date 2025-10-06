// utils/ReelUtils.ts
import * as PIXI from "pixi.js";

export function createSpinSequence(
  currentSymbols: string[],
  finalSymbols: string[],
  middleCount: number
): string[] {
  const allSymbolsKeys = Object.keys(PIXI.Loader.shared.resources).filter((k) =>
    /^SYM\d{2}$/.test(k)
  );

  return [
    ...currentSymbols,
    ...Array.from(
      { length: middleCount },
      () => allSymbolsKeys[Math.floor(Math.random() * allSymbolsKeys.length)]
    ),
    ...finalSymbols.map(
      (s) => `SYM${s.match(/\d+/)?.[0].padStart(2, "0") || "01"}`
    ),
  ];
}

export function linear(t: number): number {
  return t;
}

export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

export function easeOutQuad(t: number): number {
  return 1 - (1 - t) * (1 - t);
}
