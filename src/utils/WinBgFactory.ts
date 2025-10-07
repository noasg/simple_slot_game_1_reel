// utils/WinBgFactory.ts
import * as PIXI from "pixi.js";

//Creates background highlight sprites for winning symbols on a reel.
export function createWinBgs(
  texture: PIXI.Texture,
  reelWidth: number,
  slotHeight: number,
  borderSize: number,
  visibleCount = 3
): PIXI.Sprite[] {
  const winBgs: PIXI.Sprite[] = [];

  for (let i = 0; i < visibleCount; i++) {
    const winSprite = new PIXI.Sprite(texture);

    // Set width/height based on reel and slot, accounting for borders
    winSprite.width = reelWidth - borderSize * 2;
    winSprite.height = slotHeight - borderSize * 2;
    winSprite.visible = false; // or false initially

    // Position each background relative to the reel
    winSprite.x = borderSize;
    winSprite.y = borderSize + i * slotHeight;
    winBgs.push(winSprite);
  }

  return winBgs;
}
