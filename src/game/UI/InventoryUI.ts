interface InventoryItem {
  sprite: Phaser.GameObjects.Sprite;
  label: Phaser.GameObjects.Text;
  value: number;
  statType: string;
}

export class InventoryUI extends Phaser.GameObjects.Container {
  private items: InventoryItem[] = [];
  private readonly maxSlots = 5;
  private readonly slotSpacing = 60;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);
    scene.add.existing(this);

    scene.events.on("coin-collected", (coinData: any) => {
      this.addItem(coinData.texture, coinData.value, coinData.stat);
    });
  }

  public addItem(texture: string, value: number, stat: string) {
    // 1. Efecto cola: si el inventario está lleno, eliminar el más antiguo
    if (this.items.length >= this.maxSlots) {
      const oldest = this.items.shift();
      oldest?.sprite.destroy();
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

    const newItem: InventoryItem = { sprite, label, value, statType: stat };

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
        targets: [item.sprite, item.label],
        x: posX,
        duration: 200,
        ease: "Back.easeOut",
      });
    });
  }

  public clearInventory() {
    this.items.forEach((item) => {
      item.sprite.destroy();
      item.label.destroy();
    });
    this.items = [];
  }
}
