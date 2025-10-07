import * as PIXI from "pixi.js";
import { borderSize } from "./Constants";

//Creates a PIXI.Sprite for a single slot machine symbol
export function createSymbolSprite(
  symbol: string,
  reelWidth: number,
  slotHeight: number,
  x: number,
  y: number,
  mask: PIXI.Graphics
): PIXI.Sprite | null {
  // Extract the numeric part of the symbol and normalize it to two digits
  const num = symbol.match(/\d+/)?.[0].padStart(2, "0") || "01";
  const normalized = `SYM${num}`;

  // Get the loaded texture from PIXI loader
  const texture = PIXI.Loader.shared.resources[normalized]?.texture;
  if (!texture) return null;

  const sprite = new PIXI.Sprite(texture);

  // Set sprite width and height relative to reel size and border
  sprite.width = 90 % (reelWidth - 2 * borderSize);
  sprite.height = 90 % (slotHeight - 2 * borderSize);

  // Center horizontally within the reel and offset vertically for the border
  sprite.x = x + (reelWidth - sprite.width) / 2;
  sprite.y = y + borderSize;

  // Apply the mask to clip overflowing symbols
  sprite.mask = mask;
  return sprite;
}
