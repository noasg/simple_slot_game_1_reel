import * as PIXI from "pixi.js";

export function animateReel(
  sprites: PIXI.Sprite[],
  slotHeight: number,
  // totalHeight: number,
  finalOffset: number,
  duration: number,
  onComplete: () => void
): PIXI.Ticker {
  let elapsed = 0;
  const ticker = new PIXI.Ticker();

  // Store initial positions
  const startYs = sprites.map((s, i) => {
    if (i < 3) return s.y; // top 3 start where they are
    return s.y - slotHeight; // extra symbol starts above the mask
  });

  ticker.add((deltaTime) => {
    elapsed += deltaTime * (1000 / 60); // convert to ms
    const t = Math.min(elapsed / duration, 1);
    const offset = t * finalOffset;

    // Move all sprites downward smoothly
    sprites.forEach((sprite, i) => {
      sprite.y = startYs[i] + offset;
      // optional: hide symbols outside the mask
      sprite.visible = sprite.y + slotHeight > 0 && sprite.y < slotHeight * 3;
    });

    if (t >= 1) {
      ticker.stop();

      const visibleCount = 3; // final visible symbols
      const totalSymbols = sprites.length;

      // sort by Y to get last 3 visible
      sprites.sort((a, b) => a.y - b.y);

      // hide all first
      sprites.forEach((s) => (s.visible = false));

      // snap final 3 symbols into mask
      for (let i = 0; i < visibleCount; i++) {
        const sprite = sprites[totalSymbols - visibleCount + i];
        sprite.visible = true;
        sprite.y = i * slotHeight;
      }

      const visible = sprites
        .slice(totalSymbols - visibleCount)
        .map((s) => s.texture.textureCacheIds?.[0] || "unknown");
      console.log("✅ Final visible symbols:", visible);

      onComplete();
    }
  });

  ticker.start();
  return ticker;
}
