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
    elapsed += deltaTime * (1000 / 3100);
    const t = Math.min(elapsed / duration, 1);
    const offset = t * finalOffset;

    sprites.forEach((sprite, i) => {
      sprite.y = (i * slotHeight + offset) % totalHeight;
    });

    if (t >= 1) {
      // stop ticker first
      ticker.stop();

      const visibleCount = 3;
      const totalSymbols = sprites.length;

      // sort by Y before final positioning to prevent overlaps
      sprites.sort((a, b) => a.y - b.y);

      // take last 3 from full sequence
      const lastThree = sprites.slice(totalSymbols - visibleCount);

      // clear all Y positions before final layout
      sprites.forEach((s) => (s.visible = false));

      // layout the last 3 correctly
      for (let i = 0; i < visibleCount; i++) {
        const sprite = lastThree[i];
        sprite.visible = true;
        sprite.y = i * slotHeight;
      }

      const visible = lastThree.map(
        (s) => s.texture.textureCacheIds?.[0] || "unknown"
      );
      console.log("✅ Final visible symbols:", visible);

      onComplete();
    }
  });

  ticker.start();
  return ticker;
}
