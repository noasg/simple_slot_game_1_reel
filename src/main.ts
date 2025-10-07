import * as PIXI from "pixi.js";
import { CanvasResize } from "./utils/CanvasResize";
import { ReelModel } from "./model/ReelModel";
import { SymbolsPath } from "./model/SymbolsPath";
import { SpinButton } from "./View/SpinButtonView";
import { GameController } from "./Controller/GameController";
import { AssetLoader } from "./utils/AssetLoader";
import { GameUI } from "./utils/GameUI";
import { ReelView } from "./View/ReelView";

const GAME_WIDTH = 500;
const GAME_HEIGHT = 400;

export const app = new PIXI.Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
});

// Make PIXI DevTools aware of this app
(globalThis as any).__PIXI_APP__ = app;

// Resize canvas
CanvasResize.attachResizeListener(app, GAME_WIDTH, GAME_HEIGHT, 0.1);

// UI
const ui = new GameUI(app, GAME_WIDTH, GAME_HEIGHT);

// Model
const symbolsOrder = new SymbolsPath();
const reel = new ReelModel(symbolsOrder);
const initialResult = reel.spin();

PIXI.Loader.shared.add("win_bg", "assets/WIN_BG.png");

// Load assets and start game
AssetLoader.loadAssets(() => {
  // Create reel view
  const reelView = new ReelView(
    PIXI.Loader.shared.resources["reel"].texture!,
    initialResult.symbols,
    120, // reel width
    340 // reel height
  );

  reelView.x = 20;
  reelView.y = 50;
  app.stage.addChild(reelView);

  // Create button
  const button = new SpinButton(
    PIXI.Loader.shared.resources["play"].texture!,
    PIXI.Loader.shared.resources["play_disabled"].texture!,
    60,
    60
  );

  button.x = GAME_WIDTH - button.width - 20;
  button.y = GAME_HEIGHT / 2 - button.height / 2;
  app.stage.addChild(button);

  // Controller now knows about the reelView
  new GameController(reel, button, ui.message, reelView, ui);
});
