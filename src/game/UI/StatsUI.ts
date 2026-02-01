import { GameScene } from "../scenes/GameScene";
import { PlayerStats } from "../state/gameState";
import { basicColors } from "./colors";

const statConfigs = [
  { key: "attackBase", icon: "moneda_ares" },
  { key: "defenseBase", icon: "moneda_vida" },
  { key: "speedBase", icon: "moneda_sonic" },
  { key: "regenBase", icon: "moneda_pulpo" },
  { key: "rangeBase", icon: "projectile" },
] as const;

export class StatsPanelUI extends Phaser.GameObjects.Container {
  private boxes: Map<
    string,
    { text: Phaser.GameObjects.Text; sprite: Phaser.GameObjects.Sprite }
  > = new Map();

  private readonly boxSize = 50;
  private readonly spacing = 15;
  private readonly goldBorder = Phaser.Display.Color.HexStringToColor(
    basicColors.creamGrey,
  ).color;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    initialStats: PlayerStats,
  ) {
    super(scene, x, y);

    statConfigs.forEach((config, index) => {
      const posY = index * (this.boxSize + this.spacing + 20); // 20 extra para el texto de abajo
      this.createStatBox(
        config.key,
        config.icon,
        posY,
        initialStats[config.key as keyof PlayerStats],
      );
    });

    this.setScrollFactor(0);
    this.setDepth(100);
    scene.add.existing(this);

    (scene as GameScene).typedEvents.on("stats-changed", (stats) => {
      statConfigs.forEach((elem) => this.updateStat(elem.key, stats[elem.key]));
    });
    (scene as GameScene).typedEvents.on("local-coins-changed", (_) => {
      const playerStats = (scene as GameScene).fatManager.getTransformedState()
        .baseStats;
      statConfigs.forEach((elem) =>
        this.updateStat(elem.key, playerStats[elem.key]),
      );
    });
  }

  private createStatBox(
    key: string,
    texture: string,
    y: number,
    value: number,
  ) {
    const graphics = this.scene.add.graphics();

    // Marco de la caja (copy paste de otros menús)
    graphics.fillStyle(
      Phaser.Display.Color.HexStringToColor(basicColors.cream).color,
      0.8,
    );
    graphics.lineStyle(3, this.goldBorder, 1);
    graphics.fillRoundedRect(0, y, this.boxSize, this.boxSize, 8);
    graphics.strokeRoundedRect(0, y, this.boxSize, this.boxSize, 8);
    this.add(graphics);

    // Sprite del Item (Centrado en la caja)
    const sprite = this.scene.add.sprite(
      this.boxSize / 2,
      y + this.boxSize / 2,
      texture,
    );
    sprite.setDisplaySize(this.boxSize * 0.7, this.boxSize * 0.7);
    this.add(sprite);

    // Texto del valor (Justo debajo de la caja)
    const valText = this.scene.add
      .text(this.boxSize / 2, y + this.boxSize + 10, value.toFixed(1), {
        fontSize: "14px",
        fontFamily: "Arial",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    this.add(valText);

    // Guardamos referencia para actualizaciones futuras
    this.boxes.set(key, { text: valText, sprite });
  }

  /**
   * Actualiza un stat específico con una animación cuqui
   */
  public updateStat(key: keyof PlayerStats, newValue: number) {
    const entry = this.boxes.get(key);
    if (!entry) return;

    entry.text.setText(newValue.toFixed(1));

    // Feedback visual al cambiar el stat
    this.scene.tweens.add({
      targets: [entry.sprite, entry.text],
      displayWidth: this.boxSize * 0.85,
      displayHeight: this.boxSize * 0.85,
      duration: 100,
      yoyo: true,
      ease: "Quad.easeOut",
    });
  }
}
