// utils/SymbolFactory.ts
import * as PIXI from "pixi.js";

export function createSymbolSprite(
  symbol: string,
  reelWidth: number,
  slotHeight: number,
  x: number,
  y: number,
  mask: PIXI.Graphics
): PIXI.Sprite | null {
  const num = symbol.match(/\d+/)?.[0].padStart(2, "0") || "01";
  const normalized = `SYM${num}`;
  const texture = PIXI.Loader.shared.resources[normalized]?.texture;
  if (!texture) return null;

  const sprite = new PIXI.Sprite(texture);
  sprite.width = reelWidth * 0.8;
  sprite.height = slotHeight * 0.9;
  sprite.x = (reelWidth - sprite.width) / 2 + x;
  sprite.y = y;
  sprite.mask = mask;
  return sprite;
}
