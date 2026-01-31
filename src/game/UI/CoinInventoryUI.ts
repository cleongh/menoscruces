import { Coin } from "../state/GameState";

export class CoinInventoryUI extends Phaser.GameObjects.Container {
  private coins: Phaser.GameObjects.Sprite[] = [];

  private maxSlots = 5;
  private slotSpacing = 60;
  private coinSize = 30;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    maxSlots: number = 5,
    slotSpacing: number = 60,
    coinSize: number = 30,
  ) {
    super(scene, x, y);

    this.maxSlots = maxSlots;
    this.slotSpacing = slotSpacing;
    this.coinSize = coinSize;

    // Ajuste para que la UI se quede fija en la pantalla aunque se mueva la cámara
    this.setScrollFactor(0);
    this.setDepth(100); // y esto para que siempre esté encima de todo

    scene.add.existing(this);
  }

  public addItem(texture: string) {
    if (this.coins.length >= this.maxSlots) {
      const oldest = this.coins.shift();
      oldest?.destroy();
    }

    const sprite = this.scene.add
      .sprite(this.x, this.y, texture)
      .setDisplaySize(this.coinSize, this.coinSize);

    this.coins.push(sprite);
    this.add([sprite]);

    this.refreshPositions();
  }

  private refreshPositions() {
    const displayOrder = [...this.coins].reverse();

    displayOrder.forEach((item, index) => {
      const posX = index * this.slotSpacing;

      this.scene.tweens.add({
        targets: [item],
        x: posX,
        duration: 250,
        ease: "Back.easeOut",
      });
    });
  }

  public clearInventory() {
    this.coins.forEach((item) => {
      item.destroy();
    });
    this.coins = [];
  }
}
