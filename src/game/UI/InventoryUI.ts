import { GameScene } from "../scenes/GameScene";
import { Coin } from "../state/gameState";

import { CoinCounterUI } from "./CoinCounterUI";
import { CoinInventoryUI } from "./CoinInventoryUI";

export class InventoryUI extends Phaser.GameObjects.Container {
  private localCoins: CoinInventoryUI;
  private permanentCoins: CoinInventoryUI;

  private readonly maxLocalSlots = 5;
  private readonly maxPermanentSlots = 25;
  private readonly slotSpacing = 50;

  // UI para contar monedas locales
  private localCounterUI: CoinCounterUI;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);

    // Ajuste para que la UI se quede fija en la pantalla aunque se mueva la cámara
    this.setScrollFactor(0);
    this.setDepth(100); // y esto para que siempre esté encima de todo

    this.localCounterUI = new CoinCounterUI(this.scene, 280, 97);
    this.add([this.localCounterUI]);

    this.localCoins = new CoinInventoryUI(
      scene,
      0,
      95,
      this.maxLocalSlots,
      this.slotSpacing,
      40,
    );
    this.add(this.localCoins);

    this.permanentCoins = new CoinInventoryUI(
      scene,
      0,
      32,
      this.maxPermanentSlots,
      35,
      25,
    );
    this.add(this.permanentCoins);

    scene.add.existing(this);

    scene.typedEvents.on("big-coin-collected", (coinData: Coin) => {
      this.localCoins.addItem({ ...coinData });
    });

    scene.typedEvents.on("coins-commited", (coins: Coin[]) => {
      this.permanentCoins.addItems(coins);
    });

    scene.typedEvents.on("local-coins-changed", (newValue) => {
      this.localCounterUI.updateCount(newValue);
    });

    scene.typedEvents.on("current-coins-reset", () => {
      this.localCoins.clearInventory();
    });
  }
}
