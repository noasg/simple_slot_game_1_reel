import * as PIXI from "pixi.js";

export function animateReel(
  sprites: PIXI.Sprite[],
  slotHeight: number,
  finalOffset: number,
  duration: number,
  onComplete: () => void
): PIXI.Ticker {
  let elapsed = 0;
  const ticker = new PIXI.Ticker();

  // Store initial positions for smooth drop
  const startYs = sprites.map((s, i) => {
    // top 3 stay at current position
    if (i < 3) return s.y;
    // extra symbols start just above the top symbol
    return s.y - slotHeight;
  });

  ticker.add((deltaTime) => {
    elapsed += deltaTime * (1000 / 60); // convert to ms
    const t = Math.min(elapsed / duration, 1);
    const offset = t * finalOffset;

    // Move all sprites downward smoothly
    sprites.forEach((sprite, i) => {
      sprite.y = startYs[i] + offset;
      // hide symbols outside mask
      sprite.visible = sprite.y + slotHeight > 0 && sprite.y < slotHeight * 3;
    });

    if (t >= 1) {
      ticker.stop();

      // Snap the final 3 symbols into the mask
      for (let i = 0; i < 3; i++) {
        const sprite = sprites[sprites.length - 3 + i]; // last 3 in the array
        sprite.visible = true;
        sprite.y = i * slotHeight;
      }

      const visible = sprites
        .slice(sprites.length - 3)
        .map((s) => s.texture.textureCacheIds?.[0] || "unknown");

      console.log("✅ Final visible symbols:", visible);

      onComplete();
    }
  });

  ticker.start();
  return ticker;
}
