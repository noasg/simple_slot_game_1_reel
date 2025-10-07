import * as PIXI from "pixi.js";
import { CanvasResize } from "./utils/CanvasResize";
import { ReelModel } from "./model/ReelModel";
import { SymbolsPath } from "./model/SymbolsPath";
import { SpinButton } from "./View/SpinButtonView";
import { GameController } from "./Controller/GameController";
import { AssetLoader } from "./utils/AssetLoader";
import { GameUI } from "./utils/GameUI";
import { ReelView } from "./View/ReelView";

// constants for game dimensions
const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;

// setting canvas size, background color, resolution and density
export const app = new PIXI.Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

// make Pixi app globally -> for debugging
(globalThis as any).__PIXI_APP__ = app;

// make the canvas responsive
CanvasResize.attachResizeListener(app, GAME_WIDTH, GAME_HEIGHT, 0.1);

// initialize the Game UI -> messages, balance, spin cost, and border
const ui = new GameUI(app, GAME_WIDTH, GAME_HEIGHT);

// Initialize the game Model
// SymbolsPath defines the reel symbol order
// ReelModel handles game logic (balance, spins, payouts)
const symbolsOrder = new SymbolsPath();
const reel = new ReelModel(symbolsOrder);
const initialResult = reel.spin(); // Get initial 3 symbols to display

// loading assets for wheel, button, and win background
PIXI.Loader.shared.add("win_bg", "assets/WIN_BG.png");

AssetLoader.loadAssets(() => {
  const reelView = new ReelView(
    PIXI.Loader.shared.resources["reel"].texture!,
    initialResult.symbols,
    120,
    340
  );

  reelView.x = 20;
  reelView.y = 50;
  app.stage.addChild(reelView);

  const button = new SpinButton(
    PIXI.Loader.shared.resources["play"].texture!,
    PIXI.Loader.shared.resources["play_disabled"].texture!,
    60,
    60
  );

  button.x = GAME_WIDTH - button.width - 20;
  button.y = GAME_HEIGHT / 2 - button.height / 2;
  app.stage.addChild(button);

  // GameController to manage game flow
  // Connects Model, View, and UI
  new GameController(reel, button, ui.message, reelView, ui);
});
