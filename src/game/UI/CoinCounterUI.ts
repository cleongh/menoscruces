export class CoinCounterUI extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Graphics;
  private icon: Phaser.GameObjects.Sprite;
  private countText: Phaser.GameObjects.Text;
  private currentCount: number = 0;

  // Configuración de estilo
  private readonly padding = 15;
  private readonly targetHeight = 65;
  private readonly targetWidth = 120;
  private readonly coinSize = 53;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialCount: number = 0,
    coinTexture: string = "coin",
  ) {
    super(scene, x, y);
    this.currentCount = initialCount;

    // Fondo con el borde redondeado y que contenga al multiplicador
    this.background = scene.add.graphics();
    this.background.fillStyle(0x222222, 0.8);
    this.background.lineStyle(3, 0xffd700, 1);
    this.background.fillRoundedRect(
      0,
      -this.targetHeight / 2,
      this.targetWidth,
      this.targetHeight,
      8,
    );
    this.background.strokeRoundedRect(
      0,
      -this.targetHeight / 2,
      this.targetWidth,
      this.targetHeight,
      8,
    );
    this.add(this.background);

    // Icono de la moneda
    // TODO: Esto está muy a ojímetro
    this.icon = scene.add.sprite(this.padding + 25, 0, coinTexture);
    this.icon.setDisplaySize(this.coinSize, this.coinSize);
    this.add(this.icon);

    // 3. Texto del contador (Formato: x 000)
    this.countText = scene.add.text(
      this.padding + 55,
      0,
      `x ${this.currentCount}`,
      {
        fontSize: "20px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      },
    );
    this.countText.setOrigin(0, 0.5); // Origen a la izquierda y centrado vertical
    this.add(this.countText);

    // Ajustes de cámara y profundidad
    this.setScrollFactor(0);
    this.setDepth(100);
    scene.add.existing(this);
  }

  /**
   * Actualiza el contador con un nuevo valor y reproduce una animación cuqui
   */
  public updateCount(newCount: number) {
    this.currentCount = newCount;
    this.countText.setText(`x ${this.currentCount}`);

    const targetSize = this.coinSize * 1.2;

    this.scene.tweens.add({
      targets: this.icon,
      displayWidth: targetSize,
      displayHeight: targetSize,
      duration: 100,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }
}
