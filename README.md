Slot Machine Game ( Typescript + PIXI.js)

Reel Model: Manages game state, balance, spin cost, and win calculation.

Reel View: Displays animated reels, symbols, and visual highlights for wins.

Spin Button: Interactive button that supports normal spins and force stops.

Game UI: Shows balance, spin cost, and spin/win messages.

Win Manager: Handles temporary highlighting of winning combinations.

Responsive Canvas: Auto-resizes to fit different screen sizes while maintaining aspect ratio.

Asset Management: Preloads textures for symbols, buttons, reels, and win highlights.

Spin Logic: Supports randomized spinning with configurable animation duration.

Force Stop: Players can stop a spin early, immediately showing the final result.

Dynamic Button State: Spin button disables automatically if the player has insufficient balance.


Project Structure
src/
├─ model/        # Game state and logic (ReelModel, SymbolsPath)

├─ view/         # Visual components (ReelView, SpinButtonView)

├─ controller/   # GameController: handles interactions and updates

├─ utils/        # Helpers: animation, UI, constants, asset loading, win management

├─ main.ts       # Entry point: initializes PIXI, UI, model, controller


How It Works

Game Initialization: The main.ts file loads assets, creates the UI, reels, and controller.

Spinning: Clicking the spin button triggers the GameController, which asks the ReelModel for the next result and updates the ReelView.

Animation: ReelView animates the spin using animateReel and sequences symbols smoothly.

Win Check: After the spin, the WinManager highlights winning symbols and updates the balance.

Force Stop: Players can force a spin to finish early. The game immediately shows final symbols and updates the balance.

Animation duration, reel layout, and symbol sequences are easily adjustable.

Messages like "Spinning…" or "You won!" are defined in constants for easy localization or styling.
