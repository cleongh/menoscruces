import { Coin } from "../state/GameState";
import { CoinInventoryUI } from "./CoinInventoryUI";

export class InventoryUI extends Phaser.GameObjects.Container {
  private localCoins: CoinInventoryUI;
  private permanentCoins: CoinInventoryUI;

  private readonly maxLocalSlots = 5;
  private readonly maxPermanentSlots = 30;
  private readonly slotSpacing = 50;

  // Counters
  private localCoinCount: number = 0;

  // UI Text elements
  private localCounterText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Ajuste para que la UI se quede fija en la pantalla aunque se mueva la cámara
    this.setScrollFactor(0);
    this.setDepth(100); // y esto para que siempre esté encima de todo

    this.localCounterText = scene.add.text(
      this.scene.cameras.main.width - 300,
      15,
      `Monedas Actuales: 0`,
      {
        fontSize: "18px",
        color: "#ffd700",
        stroke: "#000",
        strokeThickness: 3,
      },
    );

    this.add([this.localCounterText]);

    this.localCoins = new CoinInventoryUI(
      scene,
      0,
      50,
      this.maxLocalSlots,
      this.slotSpacing,
      30,
    );
    this.add(this.localCoins);

    this.permanentCoins = new CoinInventoryUI(
      scene,
      0,
      25,
      this.maxPermanentSlots,
      this.slotSpacing / 2,
      15,
    );
    this.add(this.permanentCoins);

    scene.add.existing(this);

    scene.events.on("big-coin-collected", (coinData: Coin) => {
      this.localCoins.addItem(coinData.texture);
      this.permanentCoins.addItem(coinData.texture);
    });

    scene.events.on("coin-committed", (coinData: Coin) => {
      this.permanentCoins.addItem(coinData.texture);
    });

    scene.events.on("coin-collected", () => {
      this.updateLocalCounter(1);
    });
  }

  private updateLocalCounter(amount: number) {
    this.localCoinCount += amount;
    this.localCounterText.setText(`Monedas Actuales: ${this.localCoinCount}`);

    this.scene.tweens.add({
      targets: [this.localCounterText],
      scale: 1.1,
      duration: 50,
      yoyo: true,
    });
  }
}
