// utils/ReelLayoutFactory.ts
import * as PIXI from "pixi.js";

export function createBackground(
  texture: PIXI.Texture,
  width: number,
  height: number
): PIXI.Sprite {
  const bg = new PIXI.Sprite(texture);
  bg.width = width;
  bg.height = height;
  return bg;
}

export function createMask(
  width: number,
  height: number,
  borderSize: number
): PIXI.Graphics {
  const mask = new PIXI.Graphics();
  mask.beginFill(0xffffff);
  mask.drawRect(
    borderSize,
    borderSize,
    width - 2 * borderSize,
    height - 2 * borderSize
  );
  mask.endFill();
  return mask;
}
