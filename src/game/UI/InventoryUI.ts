import { Coin } from "../state/GameState";

interface InventoryItem {
  texture: Phaser.GameObjects.Sprite;
  label: Phaser.GameObjects.Text;
  value: string;
}

export class InventoryUI extends Phaser.GameObjects.Container {
  private items: InventoryItem[] = [];
  private readonly maxSlots = 5;
  private readonly slotSpacing = 60;

  // Counters
  private localCoinCount: number = 0;
  private permanentCoinCount: number = 0;

  // UI Text elements
  private localCounterText: Phaser.GameObjects.Text;
  private permanentCounterText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    // Ajuste para que la UI se quede fija en la pantalla aunque se mueva la cámara
    this.setScrollFactor(0);
    this.setDepth(100); // y esto para que siempre esté encima de todo

    this.permanentCoinCount = 0;

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

    this.permanentCounterText = scene.add.text(
      this.scene.cameras.main.width - 300,
      40,
      `Monedas Mercader: ${this.permanentCoinCount}`,
      {
        fontSize: "18px",
        color: "#ffffff",
        stroke: "#000",
        strokeThickness: 3,
      },
    );

    this.add([this.localCounterText, this.permanentCounterText]);
    scene.add.existing(this);

    scene.events.on("big-coin-collected", (coinData: Coin) => {
      this.addItem(coinData.texture, coinData.kind);
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

  private updateMerchantCounter(amount: number) {
    this.permanentCoinCount += amount;
    this.permanentCounterText.setText(
      `Monedas Mercader: ${this.permanentCoinCount}`,
    );
    this.scene.tweens.add({
      targets: [this.permanentCounterText],
      scale: 1.1,
      duration: 50,
      yoyo: true,
    });
  }

  public addItem(texture: string, value: string) {
    if (this.items.length >= this.maxSlots) {
      const oldest = this.items.shift();
      oldest?.texture.destroy();
      oldest?.label.destroy();
    }

    const sprite = this.scene.add.sprite(0, 15, texture).setDisplaySize(30, 30);
    const label = this.scene.add
      .text(0, 40, value, {
        fontSize: "12px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    const newItem: InventoryItem = { texture: sprite, label, value };

    this.items.push(newItem);
    this.add([sprite, label]);

    this.refreshPositions();
  }

  private refreshPositions() {
    const displayOrder = [...this.items].reverse();

    displayOrder.forEach((item, index) => {
      const posX = index * this.slotSpacing;

      this.scene.tweens.add({
        targets: [item.texture, item.label],
        x: posX,
        duration: 250,
        ease: "Back.easeOut",
      });
    });
  }

  public clearInventory() {
    this.items.forEach((item) => {
      item.texture.destroy();
      item.label.destroy();
    });
    this.items = [];
    this.localCoinCount = 0;
    this.localCounterText.setText(`Run Coins: 0`);
  }
}
