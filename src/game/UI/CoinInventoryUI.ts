import { colors } from "./colors";

export class CoinInventoryUI extends Phaser.GameObjects.Container {
  private coins: Phaser.GameObjects.Sprite[] = [];

  private maxSlots: number;
  private slotSpacing: number;
  private coinSize: number;

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

    // Dibujamos primero el fondo y los slots
    // Importante el orden para que las monedas queden por encima
    this.drawVisualStructure();

    this.setScrollFactor(0);
    this.setDepth(100);
    scene.add.existing(this);
  }

  private drawVisualStructure() {
    const graphics = this.scene.add.graphics();
    const padding = 15;

    // Calculamos el espacio total que ocupan los slots
    const totalSlotsWidth = (this.maxSlots - 1) * this.slotSpacing;
    // El ancho del fondo debe cubrir desde el inicio del primer slot al final del último
    const bgWidth = totalSlotsWidth + this.coinSize + padding * 2;
    const bgHeight = this.coinSize + padding * 2;

    // --- DIBUJO DEL MARCO PRINCIPAL ---
    graphics.fillStyle(0x222222, 0.8);
    graphics.lineStyle(3, 0xffd700, 1);

    // Para alinear verticalmente desde la izquierda,
    // el rectángulo empieza en x = 0. (SI NO SE VA AL LADO)
    const startX = 0;
    const startY = -bgHeight / 2;

    graphics.fillRoundedRect(startX, startY, bgWidth, bgHeight, 10);
    graphics.strokeRoundedRect(startX, startY, bgWidth, bgHeight, 10);

    // --- DIBUJO DE LOS SLOTS ---
    for (let i = 0; i < this.maxSlots; i++) {
      graphics.fillStyle(0x000000, 0.5);
      graphics.lineStyle(1, 0x555555, 1);

      const slotSize = this.coinSize + 8;

      // Calculamos la posición X para que el primer slot esté centrado
      // respecto al inicio del cuadro + padding
      const slotX = this.coinSize / 2 + padding + i * this.slotSpacing;

      graphics.fillRoundedRect(
        slotX - slotSize / 2,
        -slotSize / 2,
        slotSize,
        slotSize,
        5,
      );
      graphics.strokeRoundedRect(
        slotX - slotSize / 2,
        -slotSize / 2,
        slotSize,
        slotSize,
        5,
      );
    }

    this.add(graphics);
  }

  private refreshPositions() {
    const displayOrder = [...this.coins].reverse();
    const padding = 15;
    const firstSlotX = this.coinSize / 2 + padding;

    displayOrder.forEach((item, index) => {
      // La posición de la moneda debe coincidir con la del slot calculado arriba
      const posX = firstSlotX + index * this.slotSpacing;

      this.scene.tweens.add({
        targets: item,
        x: posX,
        y: 0,
        duration: 250,
        ease: "Back.easeOut",
      });
    });
  }

  /**
   * Añade múltiples monedas secuencialmente.
   * @param textures Array de nombres de las texturas de las monedas a añadir
   */
  public addItems(items: { texture: string; face: "head" | "tail" }[]) {
    items.forEach(({ texture, face }) => {
      // Gestión de la cola (FIFO) por cada moneda nueva
      if (this.coins.length >= this.maxSlots) {
        const oldest = this.coins.shift();
        oldest?.destroy();
      }

      // Calculamos el padding para posicionar el spawn inicial
      const padding = 15;
      const spawnX =
        (this.maxSlots - 1) * this.slotSpacing + (this.coinSize / 2 + padding);

      // Instanciamos la moneda en la posición final (derecha)
      const sprite = this.scene.add
        .sprite(spawnX, 0, texture)
        .setDisplaySize(this.coinSize, this.coinSize)
        .setTint(colors[face]);

      this.coins.push(sprite);
      this.add(sprite);
    });

    // Refrescamos posiciones una sola vez al final para que no se nos solape todo
    this.refreshPositions();
  }

  public addItem(item: { texture: string; face: "head" | "tail" }) {
    this.addItems([item]);
  }

  public clearInventory() {
    this.coins.forEach((c) => c.destroy());
    this.coins = [];
  }
}
