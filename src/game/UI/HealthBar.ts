import { GameScene } from "../scenes/GameScene";

export default class HealthBar extends Phaser.GameObjects.Container {
  private barWidth: number;
  private barHeight: number;
  private padding: number = 4;

  // Colores originales preservados
  private backgroundColor: number =
    Phaser.Display.Color.HexStringToColor("#979797").color;
  private colorFull: number =
    Phaser.Display.Color.HexStringToColor("#1eff00").color;
  private colorHalf: number =
    Phaser.Display.Color.HexStringToColor("#fff200").color;
  private colorQuarter: number =
    Phaser.Display.Color.HexStringToColor("#ff4000").color;
  private goldBorder: number = 0xffd700; // Color dorado de tus otros contenedores

  private totalHealth: number = 100;
  private currentHealth: number = 100;

  private graphics: Phaser.GameObjects.Graphics;
  private fillingRectangle: Phaser.GameObjects.Rectangle;
  private healthText: Phaser.GameObjects.Text;

  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);

    this.barWidth = scene.cameras.main.width;
    this.barHeight = 26;

    this.setScrollFactor(0);
    this.setDepth(100);

    // 1. Gráficos para el Marco Redondeado (Estilo coherente)
    this.graphics = scene.add.graphics();

    // 2. Rectángulo de fondo (detrás del relleno)
    this.fillingRectangle = new Phaser.GameObjects.Rectangle(
      scene,
      this.padding,
      0,
      this.barWidth - 2 * this.padding,
      this.barHeight - 2 * this.padding,
      this.backgroundColor,
    );
    this.fillingRectangle.setOrigin(0, 0.5);

    // Texto de salud (Ej: 37/100)
    this.healthText = scene.add.text(this.barWidth / 2, 0, "100 / 100", {
      fontSize: "14px",
      fontFamily: "Arial",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 3,
    });
    this.healthText.setOrigin(0.5);

    // Añadir al contenedor
    this.add([this.graphics, this.fillingRectangle, this.healthText]);
    scene.add.existing(this);

    // Inicializar visualmente
    this.updateHealthBar(this.totalHealth, this.currentHealth);

    scene.typedEvents.on("player-health-updated", (current) => {
      const maxHealth = (
        this.scene as GameScene
      ).fatManager.getTransformedState().baseStats.healthBase;
      this.updateHealthBar(maxHealth, current);
    });
  }

  updateHealthBar(totalHealth: number, currentHealth: number) {
    this.totalHealth = totalHealth;
    this.currentHealth = currentHealth;
    const healthPercentage = Phaser.Math.Clamp(
      currentHealth / totalHealth,
      0,
      1,
    );

    // Actualizar el ancho y color del relleno
    const totalFillingWidth = this.barWidth - 2 * this.padding;
    this.fillingRectangle.displayWidth = totalFillingWidth * healthPercentage;
    this.fillingRectangle.fillColor = this.getFillingColor(healthPercentage);

    // Actualizar el texto
    const currentFormatted = Math.max(0, currentHealth).toFixed(2);

    this.healthText.setText(`${currentFormatted} / ${totalHealth}`);

    // Redibujar el marco redondeado para que coincida con tus otros contenedores
    this.graphics.clear();

    // Fondo oscuro del contenedor
    this.graphics.fillStyle(0x222222, 0.8);
    this.graphics.lineStyle(3, this.goldBorder, 1);

    // Dibujamos el marco centrado verticalmente
    this.graphics.fillRoundedRect(
      0,
      -this.barHeight / 2,
      this.barWidth,
      this.barHeight,
      8,
    );
    this.graphics.strokeRoundedRect(
      0,
      -this.barHeight / 2,
      this.barWidth,
      this.barHeight,
      8,
    );
  }

  getFillingColor(healthPercentage: number): number {
    if (healthPercentage > 0.5) return this.colorFull;
    if (healthPercentage > 0.25) return this.colorHalf;
    return this.colorQuarter;
  }
}
