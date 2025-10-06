// utils/WinBgFactory.ts
import * as PIXI from "pixi.js";

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
    winSprite.width = reelWidth - borderSize * 2;
    winSprite.height = slotHeight - borderSize * 2;
    winSprite.visible = true; // or false initially
    winSprite.x = borderSize;
    winSprite.y = borderSize + i * slotHeight;
    winBgs.push(winSprite);
  }

  return winBgs;
}
