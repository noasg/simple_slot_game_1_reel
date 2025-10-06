// utils/SymbolFactory.ts
import * as PIXI from "pixi.js";
import { borderSize } from "./Constants";

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
  sprite.width = 90 % (reelWidth - 2 * borderSize);
  sprite.height = 90 % (slotHeight - 2 * borderSize);
  sprite.x = x + (reelWidth - sprite.width) / 2;
  sprite.y = y + borderSize;
  sprite.mask = mask;
  return sprite;
}
