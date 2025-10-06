// utils/ReelAnimator.ts
import * as PIXI from "pixi.js";

export function animateReel(
  sprites: PIXI.Sprite[],
  slotHeight: number,
  totalHeight: number,
  finalOffset: number,
  duration: number,
  onComplete: () => void
): PIXI.Ticker {
  let elapsed = 0;
  const ticker = new PIXI.Ticker();

  ticker.add((deltaTime) => {
    elapsed += deltaTime * (1000 / 60);
    const t = Math.min(elapsed / duration, 1);
    const offset = t * finalOffset;

    sprites.forEach((sprite, i) => {
      sprite.y = i * slotHeight + offset;
      if (sprite.y > totalHeight - slotHeight) {
        sprite.y -= totalHeight;
      }
    });

    if (t >= 1) {
      ticker.stop();
      onComplete();
    }
  });

  ticker.start();
  return ticker;
}
