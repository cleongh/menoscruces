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

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    scene.events.on("big-coin-collected", (coinData: Coin) => {
      this.addItem(coinData.texture, coinData.kind);
    });
  }

  public addItem(texture: string, value: string) {
    // 1. Efecto cola: si el inventario está lleno, eliminar el más antiguo1
    console.log("Adding item to inventory:", texture, value);
    if (this.items.length >= this.maxSlots) {
      const oldest = this.items.shift();
      oldest?.texture.destroy();
      oldest?.label.destroy();
    }

    // 2. crear nuevos componentes visuales
    const sprite = this.scene.add.sprite(0, 0, texture).setDisplaySize(30, 30);
    const label = this.scene.add
      .text(20, 20, value.toString(), {
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    const newItem: InventoryItem = { texture: sprite, label, value };

    // 3. añader a la lista y al contenedor
    this.items.push(newItem);
    this.add([sprite, label]);

    this.refreshPositions();
  }

  private refreshPositions() {
    // 4. Lógica de desplazamiento: el más nuevo está a la izquierda, los elementos más antiguos se mueven a la derecha
    const displayOrder = [...this.items].reverse();

    displayOrder.forEach((item, index) => {
      const posX = index * this.slotSpacing;

      // Tween para efecto de slide
      this.scene.tweens.add({
        targets: [item.texture, item.label],
        x: posX,
        duration: 200,
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
  }
}
